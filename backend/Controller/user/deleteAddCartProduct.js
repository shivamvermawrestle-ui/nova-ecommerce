import addToCartModel from "../../Model/cartProductModel.js"

const deleteAddToCartProduct = async(req,res) =>{
    try {
const currentUserId = req.userId
const cartItemId = req.body?._id

const deleted = await addToCartModel.deleteOne({
  _id: cartItemId,
  userId: currentUserId,
})

if (deleted.deletedCount === 0) {
  return res.status(404).json({
    success: false,
    message: 'Cart item not found',
  })
}

return res.status(200).json({
  data: deleted,
  message: 'Product removed from cart',
  success: true,
})
} catch (error) {
        res.status(400).json({
            message:error?.message || error,
            success:false
        })
    }

}

export default deleteAddToCartProduct