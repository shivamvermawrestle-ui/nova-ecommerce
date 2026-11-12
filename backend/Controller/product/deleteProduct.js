import ProductModel from "../../Model/productModel.js"
import UserModel from "../../Model/UserModel.js"

const DeleteProduct = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete products.",
      })
    }

    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      })
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId)

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      data: deletedProduct,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not delete product.",
    })
  }
}

export default DeleteProduct