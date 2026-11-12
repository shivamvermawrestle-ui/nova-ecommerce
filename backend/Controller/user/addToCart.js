import addToCartModel from "../../Model/cartProductModel.js";
import ProductModel from "../../Model/productModel.js";

const addToCart =async (req,res)=>{
    try {
        const {productId} = req?.body;
        if(!productId){
            return res.status(400).json({
                success:false,
                message:"Product ID is required"
            })
        }
        const product=await ProductModel.findById(productId).select("stock")
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        if(Number(product.stock??0)<1){
            return res.status(400).json({
                success:false,
                message:"This product is out of stock:"
            })
        }
        const currentUser = req.userId

        const isProductAvailable = await addToCartModel.findOne({productId,userId:currentUser})
        if(isProductAvailable){
            return res.status(400).json({
                message:"This Product is already exist in your cart",
                success:false
            })
        }
        const payload = {
            productId:productId,
            quantity:1,
            userId:currentUser,
           
        }

        const newAddToCart = new addToCartModel(payload)
        const saveProduct = await newAddToCart.save()
        return res.status(200).json({
            data:saveProduct,
            message:" Product added in your cart",
            success:true
        })
    } catch (error) {
        res.status(400).json({
            message:error.message || error,
            success:false
        })
    }
}

export default addToCart