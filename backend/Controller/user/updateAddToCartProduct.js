import addToCartModel from "../../Model/cartProductModel.js";
import ProductModel from "../../Model/productModel.js";

const updateAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const cartItemId = req.body?._id;
    const quantity = Number(req.body?.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number.",
      });
    }

    const cartItem = await addToCartModel.findOne({
      _id: cartItemId,
      userId: currentUserId,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    const product = await ProductModel.findById(cartItem.productId).select("stock");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const availableStock = Number(product.stock ?? 0);
    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message:
          "Only " + availableStock + " item(s) are currently in stock.",
      });
    }

    const updated = await addToCartModel.updateOne(
      { _id: cartItemId, userId: currentUserId },
      { $set: { quantity } }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    return res.status(200).json({
      data: updated,
      message: "Product updated.",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error?.message || error,
      success: false,
    });
  }
};

export default updateAddToCartProduct;