import ordermodel from "../../Model/orderModel.js"
import ProductReviewModel from "../../Model/productReviewModel.js"
import mongoose from "mongoose";
const submitProductReview= async (req,res)=>{
        const {productId}=req.params
        const rating=Number(req.body?.rating)
        const comment=typeof req.body?.comment === "string"? req.body.comment.trim():""
            if(!mongoose.isObjectIdOrHexString(productId)){
                return res.status(400).json({
                    success:false,
                    message:"Invalid product ID."
                })
            }
            if(!Number.isInteger(rating)|| rating<1 || rating >5){
                return res.status(400).json({
                    success:false,
                    message:"Rating must be a whole number from 1 to 5."
                })
            }
            if(!comment|| comment.length>1000){
                return res.status(400).json({
                    success:false,
                    message:"Write a comment of up to 1000 characters."
                })
            }

            try{
                const hasPaidOrder= await ordermodel.exists({
                    userId:String(req.userId),
                    orderStatus:{$ne:"CANCELLED"},
                    "paymentDetails.payment_status":"paid",
               productDetails: {
  $elemMatch: { productId },
},
                })
                         if(!hasPaidOrder){
                return res.status(403).json({
                    success:false,
                    message:"You can review a product only after buying it."
                })
            }
            const review=await ProductReviewModel.findOneAndUpdate(
                {productId,userId:req.userId},
                {
                    $set:{rating,comment},
                    $setOnInsert:{productId,userId:req.userId},
                },
                {
                    upsert:true,
                    returnDocument:"after",
                    runValidators:true,
                }
            ).populate("userId","name profilePic")
            return res.status(200).json({
                success:true,
                data:review,
                message:"Review saved successfully."

            })
            }catch(error){
                if(error.code===11000){
                    return res.status(409).json({
                        success:false,
                        message:"A review for this product  already exists."
                    })
                }
                return res.status(500).json({
                    success:false,
                    message:error.message || "Could not save review"
                })
            }
}
export default  submitProductReview