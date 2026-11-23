import mongoose from "mongoose"
import ProductReviewModel from "../../Model/productReviewModel.js"

const getProductReviews=async (req,res) => {
    const {productId}=req.params
    if(!mongoose.isObjectIdOrHexString(productId)){
        return res.status(400).json({
            success:false,
            message:"Invalid product ID."
        })
    }
   try{
    const reviews = await ProductReviewModel.find({ productId })
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    const totalReviews=reviews.length
    const averageRating=totalReviews ===0 ?0 :Number((reviews.reduce((total,review)=>total+review.rating,0)/totalReviews).toFixed(1))
    return res.status(200).json({
        success:true,
        data:{
            reviews,
            averageRating,
            totalReviews
        }
    })
   }catch(error){
    return res.status(500).json({
        success:false,
        message:error.message|| "Could not load product reviews. "
    })
   }
}
export default getProductReviews