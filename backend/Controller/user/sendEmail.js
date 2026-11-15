
import UserModel from "../../Model/UserModel.js";
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const SendEmail = async (req, res) => {
  try {
    const email = req?.body?.email;
    const JSON_SECRET_KEY = process.env.JSON_SECRET_KEY 
    const FRONTEND_URL = process.env.FRONTEND_URL
    const NODEMAILER_USERID = process.env.NODEMAILER_USERID;
    const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;
  
    const data = await UserModel.findOne({ email: email });
    if (!data){
      return res.status(400).json({
        message: " email not found",
        success: false,
      });
    }
    const token = jwt.sign({id : data?._id},JSON_SECRET_KEY,{expiresIn :'1h'} )

    const  transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false, 
      auth: {
        user: NODEMAILER_USERID,
        pass: NODEMAILER_PASSWORD,
      },
    });
  
    const frontendUrl =
      req.headers?.origin ||
      (process.env.FRONTEND_URL || "").split(",")[0].trim() ||
      "https://nova-ecommerce-liard-xi.vercel.app";

    const resetLink = `${frontendUrl.replace(/\/$/, "")}/reset-password/${data?._id}/${token}`;

    const mailOptions = {
      from: NODEMAILER_USERID,
      to: email,
      subject: "Nova - Reset Your Password",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #202c50;">Reset Your Password</h2>
          <p style="color: #64718a; font-size: 14px;">We received a request to reset the password for your Nova account.</p>
          <div style="margin: 25px 0;">
            <a href="${resetLink}" style="background-color: #202c50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #8a96aa; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #8a96aa; font-size: 11px; word-break: break-all;">Direct Link: <a href="${resetLink}">${resetLink}</a></p>
        </div>
      `,
      text: `Reset your Nova password by clicking: ${resetLink}`,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error("Nodemailer sendMail error:", error);
        return res.status(500).json({
          message: "Failed to send reset email. Please verify your email configuration.",
          success: false,
        });
      } else {
        return res.status(200).json({
          message: "Password reset link sent! Please check your email inbox.",
          success: true,
        });
      }
    });
  } catch (error) {
     return res.status(400).json({
      message: error.message || error,
      success: false,
    });
  }
};

export default SendEmail;
