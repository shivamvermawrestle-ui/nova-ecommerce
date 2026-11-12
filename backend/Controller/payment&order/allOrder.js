import ordermodel from "../../Model/orderModel.js"
import UserModel from "../../Model/UserModel.js"

const allOrder = async(req,res)=>{
    try {
        const userId = req?.userId

        const user = await UserModel.findById(userId)
        if(!user || user.role !== 'ADMIN'){
            return  res.status(403).json({
                
                message : "Not authorized to view all orders",
                success:false
            })
        }
        const allOrder = await ordermodel.find().sort({createdAt : -1})
        return  res.status(200).json({
                data : allOrder,
            message : "Orders fetched  successfully",
            success:true
        })
    } catch (error) {
        res.status(400).json({
            message : error.message || error,
            success:false
        })
    }
}

export default allOrder