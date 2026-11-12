import mongoose from "mongoose";
import WishlistModel from "../../Model/wishlistModel.js";

const removeWishlistProduct = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.isObjectIdOrHexString(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
  }

  try {
    await WishlistModel.findOneAndDelete({
      userId: req.userId,
      productId,
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not remove product.",
    });
  }
};

export default removeWishlistProduct;