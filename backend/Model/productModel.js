import mongoose, { Schema } from "mongoose";
const ProductSchema = mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    FLocation : String,
    cirtificate : [],
    price: Number,
    sellingPrice: Number,
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0,
        validate:{
            validator:Number.isInteger,
            message:"Stock must be a whole number."
        }
    },
    isFeatured:{
        type:Boolean,
        default:false,
    },

},{
    timestamps:true
})

const ProductModel = mongoose.model('Product',ProductSchema)
export default ProductModel