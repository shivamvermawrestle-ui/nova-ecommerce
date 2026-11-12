import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

export default WishlistModel;