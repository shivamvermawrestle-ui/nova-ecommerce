
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
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

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

    const htmlContent = `
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
    `;

    let emailSent = false;

    // 1. Try Brevo HTTPS API if key is present (Port 443, never blocked)
    if (BREVO_API_KEY) {
      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "Nova Store",
              email: NODEMAILER_USERID || "no-reply@novastore.com",
            },
            to: [{ email: email }],
            subject: "Nova - Reset Your Password",
            htmlContent: htmlContent,
          }),
        });
        if (brevoRes.ok) emailSent = true;
      } catch (err) {
        console.warn("Brevo API error:", err.message);
      }
    }

    // 2. Try Resend HTTPS API if key is present (Port 443, never blocked)
    if (!emailSent && RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Nova <onboarding@resend.dev>",
            to: [email],
            subject: "Nova - Reset Your Password",
            html: htmlContent,
          }),
        });
        if (resendRes.ok) emailSent = true;
      } catch (err) {
        console.warn("Resend API error:", err.message);
      }
    }

    // 3. Try Nodemailer with Gmail SMTP (Works on localhost & paid hosts; times out quickly if ports blocked on free tier)
    if (!emailSent && NODEMAILER_USERID && NODEMAILER_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: NODEMAILER_USERID,
            pass: NODEMAILER_PASSWORD,
          },
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 8000,
        });

        await transporter.sendMail({
          from: `"Nova Store" <${NODEMAILER_USERID}>`,
          to: email,
          subject: "Nova - Reset Your Password",
          html: htmlContent,
          text: `Reset your Nova password by clicking: ${resetLink}`,
        });
        emailSent = true;
      } catch (smtpErr) {
        console.warn(
          "Nodemailer SMTP delivery failed (Render Free Tier blocks outbound SMTP ports 25/465/587):",
          smtpErr?.message || smtpErr
        );
      }
    }

    return res.status(200).json({
      message: emailSent
        ? "Password reset link sent! Please check your email inbox."
        : "Password reset link generated successfully! You can use the link below to reset your password.",
      success: true,
      emailSent,
      resetLink,
    });
  } catch (error) {
    console.error("SendEmail error:", error?.message || error);
    return res.status(500).json({
      message:
        error?.message || "Failed to process reset password request",
      success: false,
    });
  }
};

export default SendEmail;
