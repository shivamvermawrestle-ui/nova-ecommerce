import WishlistModel from "../../Model/WishlistModel.js"


const getWishlist = async (req, res) => {
    try {
        const wishlistItems = await WishlistModel.find({
            userId: req.userId,
        })
            .populate(
                "productId",
                "productName brandName category productImage  sellingPrice price stock"
            )
            .sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: wishlistItems
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Could not load wishlist"
        })
    }

}

export default getWishlist