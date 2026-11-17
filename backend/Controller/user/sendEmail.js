
import UserModel from "../../Model/UserModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const SendEmail = async (req, res) => {
  try {
    const email = req?.body?.email;
    const JSON_SECRET_KEY = process.env.JSON_SECRET_KEY;
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const NODEMAILER_USERID = process.env.NODEMAILER_USERID;
    const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const data = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!data) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
      });
    }

    const token = jwt.sign({ id: data?._id }, JSON_SECRET_KEY, {
      expiresIn: "1h",
    });

    const frontendUrl =
      req.headers?.origin ||
      (FRONTEND_URL || "").split(",")[0].trim() ||
      "https://nova-ecommerce-liard-xi.vercel.app";

    const resetLink = `${frontendUrl.replace(/\/$/, "")}/reset-password/${data?._id}/${token}`;

    console.log(`[PASSWORD RESET] Generated reset link for ${email}: ${resetLink}`);

    if (!NODEMAILER_USERID || !NODEMAILER_PASSWORD) {
      console.warn(
        "NODEMAILER_USERID or NODEMAILER_PASSWORD is not configured in environment variables."
      );
      return res.status(500).json({
        message:
          "Email service is not configured on the server. Please check environment variables.",
        success: false,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: NODEMAILER_USERID,
        pass: NODEMAILER_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const mailOptions = {
      from: `"Nova Store" <${NODEMAILER_USERID}>`,
      to: email,
      subject: "Nova - Reset Your Password",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
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

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Password reset link sent! Please check your email inbox.",
      success: true,
    });
  } catch (error) {
    console.error("SendEmail error:", error?.message || error);
    return res.status(500).json({
      message:
        error?.message || "Failed to send reset email. Please try again later.",
      success: false,
    });
  }
};

export default SendEmail;
