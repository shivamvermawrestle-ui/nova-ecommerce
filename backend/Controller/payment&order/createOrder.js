import jwt from 'jsonwebtoken';
import ordermodel from '../../Model/orderModel.js';
import addToCartModel from '../../Model/cartProductModel.js';

const createOrder = async (req, res) => {
    try {
        let currentUserId = req?.userId;
        let userEmail = req?.userEmail;

        // Extract token from cookie or authorization header if available
        const token = req.cookies?.token;
        if (!currentUserId && token) {
            try {
                const decoded = jwt.verify(token, process.env.JSON_SECRET_KEY);
                currentUserId = decoded?._id;
                userEmail = decoded?.email;
            } catch (err) {
                console.log("Token decode notice:", err.message);
            }
        }

        const {
            productDetails,
            paymentDetails,
            shippingAddress,
            totalAmount,
            email,
            userId,
        } = req.body;

        if (!productDetails || productDetails.length === 0) {
            return res.status(400).json({
                message: "No product details provided",
                success: false,
            });
        }

        const payload = {
            productDetails: productDetails,
            email: email || userEmail || shippingAddress?.email || "customer@organic.com",
            userId: currentUserId || userId || "guest",
            paymentDetails: {
                paymentId: paymentDetails?.paymentId || ("PAY-" + Date.now()),
                payment_method_type: paymentDetails?.payment_method_type || ["cod"],
                payment_status: paymentDetails?.payment_status || "COMPLETED",
            },
            shippingAddress: shippingAddress || {},
            shipping_options: [],
            totalAmount: Number(totalAmount) || 0,
        };

        const newOrder = new ordermodel(payload);
        const savedOrder = await newOrder.save();

        // Clear cart in MongoDB if user is logged in
        if (currentUserId) {
            try {
                await addToCartModel.deleteMany({ userId: currentUserId });
            } catch (clearErr) {
                console.log("Cart clear notice:", clearErr.message);
            }
        }

        return res.status(200).json({
            data: savedOrder,
            message: "Order successfully placed and saved to MongoDB!",
            success: true,
        });
    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({
            message: error.message || error,
            success: false,
        });
    }
};

export default createOrder;

