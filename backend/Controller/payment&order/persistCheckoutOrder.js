import mongoose from "mongoose";
import stripe from "../../DataBase/stripe.js";
import ordermodel from "../../Model/orderModel.js";
import ProductModel from "../../Model/productModel.js";
import addToCartModel from "../../Model/cartProductModel.js";

const getLineItems = async (sessionId) => {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
  });
  const productItems = [];

  for (const item of lineItems.data ?? []) {
    const stripeProduct = item?.price?.product;
    const stripeProductId =
      typeof stripeProduct === "string" ? stripeProduct : stripeProduct?.id;
    let productId = "";
    let name = item?.description || "";
    let images = [];

    if (stripeProductId) {
      try {
        const product = await stripe.products.retrieve(stripeProductId);
        productId = product?.metadata?.id || "";
        name = product?.name || name;
        images = product?.images ?? [];
      } catch (error) {
        console.warn("Could not retrieve Stripe product details:", error.message);
      }
    }

    productItems.push({
      productId,
      name,
      price: Number(item?.price?.unit_amount ?? 0) / 100,
      quantity: Number(item?.quantity ?? 0),
      images,
    });
  }

  return productItems;
};

const buildOrderDetails = (session, productDetails) => ({
  stripeCheckoutSessionId: session.id,
  productDetails,
  email: session.customer_details?.email ?? session.customer_email ?? "",
  userId: String(session.metadata.userId),
  shippingAddress: session.shipping_details ?? {},
  paymentDetails: {
    paymentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "",
    payment_method_type: session.payment_method_types ?? [],
    payment_status: session.payment_status,
  },
  shipping_options:
    session.shipping_options?.map((option) => ({
      ...option,
      shipping_amount: Number(option?.shipping_amount ?? 0) / 100,
    })) ?? [],
  totalAmount: Number(session.amount_total ?? 0) / 100,
});

const saveRefundedOrder = async (orderDetails, session) => {
  if (!session.payment_intent) {
    throw new Error("Paid session is missing its payment intent.");
  }

  const refund = await stripe.refunds.create(
    {
      payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent.id,
      metadata: {
        checkout_session_id: session.id,
        reason: "insufficient_stock",
      },
    },
    { idempotencyKey: "stock-refund-" + session.id }
  );

  try {
    return await new ordermodel({
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
  } catch (error) {
    if (error.code === 11000) {
      return ordermodel.findOne({
        stripeCheckoutSessionId: session.id,
      });
    }
    throw error;
  }
};

export const persistPaidCheckoutSession = async (session) => {
  if (!session?.id || session.payment_status !== "paid") {
    return null;
  }

  if (!session.metadata?.userId) {
    throw new Error("Paid Stripe session is missing its user ID.");
  }

  const existingOrder = await ordermodel.findOne({
    stripeCheckoutSessionId: session.id,
  });
  if (existingOrder) {
    return existingOrder;
  }

  const productDetails = await getLineItems(session.id);
  if (!productDetails.length) {
    throw new Error("Paid Stripe session has no order items.");
  }

  const orderDetails = buildOrderDetails(session, productDetails);
  const dbSession = await mongoose.startSession();

  try {
    try {
      await dbSession.withTransaction(async () => {
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
            { $inc: { stock: -quantity } },
            { new: true, session: dbSession }
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

        if (session.metadata?.checkoutType !== "buy_now") {
          await addToCartModel.deleteMany(
            { userId: String(session.metadata.userId) },
            { session: dbSession }
          );
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        const duplicateOrder = await ordermodel.findOne({
          stripeCheckoutSessionId: session.id,
        });
        if (duplicateOrder) return duplicateOrder;
      }

      if (error.code === "OUT_OF_STOCK") {
        return await saveRefundedOrder(orderDetails, session);
      }

      throw error;
    }

    return ordermodel.findOne({ stripeCheckoutSessionId: session.id });
  } finally {
    await dbSession.endSession();
  }
};

