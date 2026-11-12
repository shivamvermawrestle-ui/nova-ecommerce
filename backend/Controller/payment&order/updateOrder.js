import ordermodel from "../../Model/orderModel.js"
import UserModel from "../../Model/UserModel.js"

const UpdateOrderStatus = async (req, res) => {
  try {
    const admin = await UserModel.findById(req.userId).select("role")

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update order status.",
      })
    }

    const { orderId } = req.params
    const { orderStatus } = req.body

    const validStatuses = [
      "PLACED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ]

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      })
    }

    const updatedOrder = await ordermodel.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true, runValidators: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated.",
      data: updatedOrder,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not update order status.",
    })
  }
}

export default UpdateOrderStatus