import mongoose,{Schema} from  "mongoose"

const productReviewSchema=new Schema(
    {
        productId:{
            type:Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        userId:{
         type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5,
            validate:{
                validator:Number.isInteger,
                message:"Rating must be a whole number from 1 to 5."
            }
        },
        comment:{
            type:String,
            required:true,
            trim:true,
            maxlength:1000,
        },
    },
{
    timestamps:true,
}
)
productReviewSchema.index(
    {productId:1,userId:1},
    {unique:true}
)

const ProductReviewModel=mongoose.model(
    "ProductReview",
    productReviewSchema
)
export default  ProductReviewModel