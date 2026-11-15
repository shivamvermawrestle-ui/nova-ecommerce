import mongoose from "mongoose";
import WishlistModel from "../../Model/WishlistModel.js";
import ProductModel from "../../Model/productModel.js";

const addWishlistProduct = async (req, res) => {
  const { productId } = req.body;

  if (!mongoose.isObjectIdOrHexString(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
  }

  try {
    const productExists = await ProductModel.exists({ _id: productId });

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const wishlistItem = await WishlistModel.findOneAndUpdate(
      { userId: req.userId, productId },
      { $setOnInsert: { userId: req.userId, productId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      data: wishlistItem,
      message: "Product saved to wishlist.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not save product.",
    });
  }
};

export default addWishlistProduct;