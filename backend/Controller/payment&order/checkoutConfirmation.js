import ordermodel from "../../Model/orderModel.js";

const checkoutConfirmation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId?.startsWith("cs_")) {
      return res.status(400).json({
        success: false,
        message: "Invalid checkout session ID.",
      });
    }

    const confirmedOrder = await ordermodel
      .findOne({
        stripeCheckoutSessionId: sessionId,
        userId: String(req.userId),
      })
      .select(
        "_id orderStatus paymentDetails.payment_status totalAmount createdAt"
      );

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
    return res.status(500).json({
      success: false,
      message: error.message || "Could not check payment confirmation.",
    });
  }
};

export default checkoutConfirmation;