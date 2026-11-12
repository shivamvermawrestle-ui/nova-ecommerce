import express from 'express'

import UserLogin from '../Controller/user/UserLogin.js'
import authToken from '../middleware/AuthToken.js'
import UserDetails from '../Controller/user/UserDetails.js'
import UserLogout from '../Controller/user/UserLogout.js'
import AllUsers from '../Controller/user/AllUsers.js'
import UploadProduct from '../Controller/product/uploadProduct.js'
import uploadImage from '../upload/uploadimage.js'
import GetProduct from '../Controller/product/getProduct.js'
import UpdateProduct from '../Controller/product/updateProduct.js'
import UserSignup from '../Controller/user/UserSignup.js'
import UpdateUser from '../Controller/user/updateUser.js'
import getProductCategory from '../Controller/product/getProductCategoryOne.js'
import getCategoryWiseProduct from '../Controller/product/getCategoryWiseProduct.js'
import GetProductDetails from '../Controller/product/getProductDetails.js'
import addToCart from '../Controller/user/addToCart.js'
import countAddToCartProduct from '../Controller/user/countAddToCartProduct.js'
import viewAddToCartProduct from '../Controller/user/viewAddToCartProduct.js'
import updateAddToCartProduct from '../Controller/user/updateAddToCartProduct.js'
import deleteAddToCartProduct from '../Controller/user/deleteAddCartProduct.js'
import searchProduct from '../Controller/product/searchProduct.js'
import filterProduct from '../Controller/product/filterProduct.js'
import payment from '../Controller/payment&order/payment.js'
import webhook from '../Controller/payment&order/webhook.js'
import order from '../Controller/payment&order/order.js'
import allOrder from '../Controller/payment&order/allOrder.js'
import createOrder from '../Controller/payment&order/createOrder.js'
import SendEmail from '../Controller/user/sendEmail.js'
import ChangePassword from '../Controller/user/changePassword.js'
import DeleteProduct from '../Controller/product/deleteProduct.js'
import UpdateOrderStatus from '../Controller/payment&order/updateOrder.js'
import checkoutConfirmation from '../Controller/payment&order/checkoutConfirmation.js'
import getUserOrderById from '../Controller/payment&order/getUserOrderById.js'
import getWishlist from '../Controller/user/getWishlist.js'
import addWishlistProduct from '../Controller/user/addWishlistProduct.js'
import removeWishlistProduct from '../Controller/user/removeWishlistProduct.js'
import getProductReviews from '../Controller/product/getProductReviews.js'
import submitProductReview from '../Controller/product/submitProductReview.js'


const router = express.Router()


router.post('/signup',UserSignup)
router.post('/login',UserLogin)
router.get('/user-details',authToken,UserDetails)
router.get('/logout',UserLogout)
router.post('/send-email',SendEmail)
router.post('/reset-password/:id/:token',ChangePassword)

//admin pannel
router.get('/all-users', authToken,AllUsers)
router.post('/update-user', authToken,UpdateUser)

//upload product
router.post('/upload-product', authToken,UploadProduct)
router.post('/upload-image', authToken, uploadImage)
//get product
router.get('/get-product',GetProduct)
// update product 
router.post('/update-product',authToken,UpdateProduct)
// delete product 
router.post("/delete-product",authToken,DeleteProduct)


// access by user
router.get('/get-product-category',getProductCategory)
router.post('/category-wise-product',getCategoryWiseProduct)
router.post('/product-details',GetProductDetails)
router.get('/search-product',searchProduct)
router.post('/filter-product',filterProduct)

// user add to cart //
router.post('/addtoCart',authToken,addToCart)
router.get('/countAddtoCartProduct',authToken,countAddToCartProduct)
router.get('/viewCartProduct',authToken,viewAddToCartProduct)
router.post('/updateCartProduct',authToken,updateAddToCartProduct)
router.post('/deleteCartProduct',authToken,deleteAddToCartProduct)


// payment and order 
router.post('/payment',authToken,payment)
router.post('/webhook',webhook)   // api/webhook
router.get('/order-list',authToken,order)   // api/webhook
router.get('/all-order',authToken,allOrder)   // api/webhook
router.get("/order-confirmation/:sessionId",authToken,checkoutConfirmation)
router.get("/orders/:orderId", authToken, getUserOrderById);
router.post('/create-order',createOrder)
router.patch("/orders/:orderId/status",authToken,UpdateOrderStatus)

// wishlist 
router.get("/wishlist",authToken,getWishlist)
router.post("/wishlist", authToken, addWishlistProduct);
router.delete("/wishlist/:productId", authToken, removeWishlistProduct);

//reviews
router.get("/product-reviews/:productId",getProductReviews)
router.post("/product-reviews/:productId",authToken,submitProductReview)

export default router