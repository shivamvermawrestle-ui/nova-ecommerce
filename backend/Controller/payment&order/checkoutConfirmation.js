import ordermodel from "../../Model/orderModel.js";
import stripe from "../../DataBase/stripe.js";
import { persistPaidCheckoutSession } from "./persistCheckoutOrder.js";

const confirmationFields =
  "_id orderStatus paymentDetails.payment_status totalAmount createdAt";

const checkoutConfirmation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = String(req.userId);

    if (!sessionId?.startsWith("cs_")) {
      return res.status(400).json({
        success: false,
        message: "Invalid checkout session ID.",
      });
    }

    let confirmedOrder = await ordermodel
      .findOne({ stripeCheckoutSessionId: sessionId, userId })
      .select(confirmationFields);

    if (!confirmedOrder) {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (String(stripeSession.metadata?.userId) !== userId) {
        return res.status(404).json({
          success: false,
          message: "Checkout session not found.",
        });
      }

      if (stripeSession.payment_status !== "paid") {
        return res.status(202).json({
          success: false,
          status: "processing",
          message: "Payment confirmation is still processing.",
        });
      }

      await persistPaidCheckoutSession(stripeSession);
      confirmedOrder = await ordermodel
        .findOne({ stripeCheckoutSessionId: sessionId, userId })
        .select(confirmationFields);
    }

    if (!confirmedOrder) {
      return res.status(202).json({
        success: false,
        status: "processing",
        message: "Payment confirmation is still processing.",
      });
    }

    return res.status(200).json({
      success: true,
      data: confirmedOrder,
    });
  } catch (error) {
    console.error("Checkout confirmation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Could not check payment confirmation.",
    });
  }
};

export default checkoutConfirmation;
