import "dotenv/config";
import mongoose from "mongoose";
import stripe from "../../DataBase/stripe.js";
import ordermodel from "../../Model/orderModel.js";
import ProductModel from "../../Model/productModel.js";
import addToCartModel from "../../Model/cartProductModel.js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function getLineItems(lineItems) {
  const productItems = [];

  for (const item of lineItems?.data ?? []) {
    let productId = "";
    let name = item?.description || "";
    let images = [];

    try {
      if (item?.price?.product) {
        const product = await stripe.products.retrieve(item.price.product);
        productId = product?.metadata?.id || "";
        name = product?.name || name;
        images = product?.images ?? [];
      }
    } catch (err) {
      console.warn("Could not retrieve Stripe product details:", err.message);
    }

    productItems.push({
      productId,
      name,
      price: Number(item?.price?.unit_amount ?? 0) / 100,
      quantity: item?.quantity,
      images,
    });
  }

  return productItems;
}

const webhook = async (req, res) => {
  if (!endpointSecret) {
    return res.status(500).send("Stripe webhook secret is not configured.");
  }

  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (error) {
    return res.status(400).send("Webhook signature verification failed.");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.payment_status !== "paid") break;

        const existingOrder = await ordermodel.findOne({
          stripeCheckoutSessionId: session.id,
        });
        if (existingOrder) break;

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const productDetails = await getLineItems(lineItems);

        const orderDetails = {
          stripeCheckoutSessionId: session.id,
          productDetails,
          email: session.customer_email ?? "",
          userId: session.metadata?.userId ?? "",
          shippingAddress: session.shipping_details ?? {},
          paymentDetails: {
            paymentId: session.payment_intent ?? "",
            payment_method_type: session.payment_method_types ?? [],
            payment_status: session.payment_status,
          },
          shipping_options:
            session.shipping_options?.map((option) => ({
              ...option,
              shipping_amount: Number(option?.shipping_amount ?? 0) / 100,
            })) ?? [],
          totalAmount: Number(session.amount_total ?? 0) / 100,
        };

        const dbSession = await mongoose.startSession();

        try {
          await dbSession.withTransaction(async () => {
            // Unique checkout-session ID also prevents duplicate webhook orders.
            await new ordermodel(orderDetails).save({ session: dbSession });

            for (const item of productDetails) {
              const quantity = Number(item.quantity);

              if (
                !item.productId ||
                !Number.isInteger(quantity) ||
                quantity < 1
              ) {
                throw new Error("Stripe returned an invalid order item.");
              }

              const updatedProduct = await ProductModel.findOneAndUpdate(
                {
                  _id: item.productId,
                  stock: { $gte: quantity },
                },
                {
                  $inc: { stock: -quantity },
                },
                {
                  new: true,
                  session: dbSession,
                }
              );

              if (!updatedProduct) {
                const stockError = new Error(
                  (item.name || "A product") +
                    " is no longer available in that quantity."
                );
                stockError.code = "OUT_OF_STOCK";
                throw stockError;
              }
            }

            if (session.metadata?.userId) {
              await addToCartModel.deleteMany(
                { userId: session.metadata.userId },
                { session: dbSession }
              );
            }
          });
        } catch (error) {
          if (error.code === 11000) {
            return res.status(200).send("Order already processed.");
          }

          if (error.code === "OUT_OF_STOCK") {
            if (!session.payment_intent) {
              return res.status(500).send("Paid session is missing its payment intent.");
            }

            try {
              const refund = await stripe.refunds.create(
                {
                  payment_intent: session.payment_intent,
                  metadata: {
                    checkout_session_id: session.id,
                    reason: "insufficient_stock",
                  },
                },
                {
                  idempotencyKey: "stock-refund-" + session.id,
                }
              );

              await new ordermodel({
                ...orderDetails,
                orderStatus: "CANCELLED",
                paymentDetails: {
                  ...orderDetails.paymentDetails,
                  payment_status:
                    refund.status === "succeeded"
                      ? "refunded"
                      : "refund_" + refund.status,
                  refundId: refund.id,
                },
              }).save();

              return res.status(200).send("Stock conflict refunded.");
            } catch (refundError) {
              if (refundError.code === 11000) {
                return res.status(200).send("Refund already recorded.");
              }

              console.error("Stock-conflict refund failed:", refundError);
              return res
                .status(500)
                .send("Could not complete the stock-conflict refund.");
            }
          }

          throw error;
        } finally {
          await dbSession.endSession();
        }

        break;
      }

      default:
        console.log("Unhandled Stripe event:", event.type);
    }

    return res.status(200).send();
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return res.status(500).send("Webhook processing failed.");
  }
};

export default webhook;