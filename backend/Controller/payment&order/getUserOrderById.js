import mongoose from "mongoose";
import ordermodel from "../../Model/orderModel.js";

const getUserOrderById = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.isObjectIdOrHexString(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  try {
    const userOrder = await ordermodel.findOne({
      _id: orderId,
      userId: String(req.userId),
    });

    if (!userOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: userOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not load the order.",
    });
  }
};

export default getUserOrderById;