import mongoose from "mongoose";
import ProductModel from "../../Model/productModel.js";
import UserModel from "../../Model/UserModel.js";
import stripe from "../../DataBase/stripe.js";
import addToCartModel from "../../Model/cartProductModel.js";

const payment = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in to checkout.",
      });
    }

    const { productId, quantity: requestedQuantity } = req.body ?? {};
    const isBuyNow = Boolean(productId);
    let requestedItems = [];

    if (isBuyNow) {
      const normalizedProductId = String(productId);
      const quantity = Number(requestedQuantity ?? 1);

      if (!mongoose.isValidObjectId(normalizedProductId)) {
        throw new Error("Invalid product.");
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be a positive whole number.");
      }

      requestedItems = [{ productId: normalizedProductId, quantity }];
    } else {
      const cartItems = await addToCartModel
        .find({ userId: req.userId })
        .select("productId quantity");

      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Your cart is empty.",
        });
      }

      requestedItems = cartItems.map((item) => {
        const cartProductId = item.productId?.toString();
        const quantity = Number(item.quantity);

        if (
          !cartProductId ||
          !mongoose.isValidObjectId(cartProductId) ||
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          throw new Error("Invalid cart item.");
        }

        return { productId: cartProductId, quantity };
      });
    }

    const products = await ProductModel.find({
      _id: { $in: requestedItems.map((item) => item.productId) },
    });
    const productById = new Map(
      products.map((product) => [String(product._id), product])
    );

    const lineItems = requestedItems.map(({ productId: requestedId, quantity }) => {
      const product = productById.get(requestedId);

      if (!product) {
        throw new Error("A product could not be found.");
      }

      const availableStock = Number(product.stock ?? 0);
      if (!Number.isInteger(availableStock) || availableStock < 0) {
        throw new Error("A product has an invalid stock value.");
      }
      if (quantity > availableStock) {
        throw new Error(
          product.productName +
            " has only " +
            availableStock +
            " item(s) in stock."
        );
      }

      const price = Number(product.sellingPrice);
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error("A product has an invalid price.");
      }

      const rawImages = Array.isArray(product.productImage)
        ? product.productImage
        : typeof product.productImage === "string" && product.productImage
          ? [product.productImage]
          : [];
      const validImages = rawImages
        .filter((image) => typeof image === "string" && image.startsWith("https://"))
        .slice(0, 8);

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.productName,
            images: validImages,
            metadata: { id: String(product._id) },
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });

    const shippingAmountInr = Number(process.env.SHIPPING_AMOUNT_INR ?? 0);
    if (!Number.isFinite(shippingAmountInr) || shippingAmountInr < 0) {
      throw new Error("Shipping amount configuration is invalid.");
    }

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173")
      .trim()
      .replace(/\/$/, "");

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Standard delivery",
            fixed_amount: {
              amount: Math.round(shippingAmountInr * 100),
              currency: "inr",
            },
          },
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: String(req.userId),
        checkoutType: isBuyNow ? "buy_now" : "cart",
      },
      line_items: lineItems,
      success_url: frontendUrl + "/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: frontendUrl + "/cancel",
    };

    const session = await stripe.checkout.sessions.create(params);

    return res.status(200).json({
      data: session,
      message: "Checkout session created.",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Could not start checkout.",
      success: false,
    });
  }
};

export default payment;
