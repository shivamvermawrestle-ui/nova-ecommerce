
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../../Model/UserModel.js';

const UserLogin = async(req,res) => {
    try {
        const rawEmail = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password;
        if(!rawEmail || !password){
            return res.status(400).json({
                message: "Email and password are required"
            })
        }
        const user =
          (await UserModel.findOne({ email: rawEmail })) ||
          (await UserModel.findOne({
            email: { $regex: new RegExp(`^${rawEmail}$`, 'i') },
          }))
        if(!user){
            return res.status(400).json({
                message: "User not found"
            })
        }
        const isValidPassword = await bcrypt.compare(password,user.password)
        if(isValidPassword){
             const tokenData = {
                  _id:user._id,
                  email:user.email,
                  role:user.role,
             }
          const token =  await jwt.sign(tokenData , process.env.JSON_SECRET_KEY, { expiresIn: '30d' });
          const isProduction = process.env.NODE_ENV === 'production';
          const tokenOption = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'lax',
            maxAge:30*24*60*60*1000
          }
          res.cookie('token',token,tokenOption).status(200).json({
            message: "Login Successfull",
            data:token,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                profilePic:user.profilePic
            },
            success:true,
          })
        }
        else{
            return res.status(400).json({
                message: "invalid email or password please check!"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error?.message || "Login failed. Please try again.",
            error: true,
            success: false
        })
    }
}


export default UserLogin