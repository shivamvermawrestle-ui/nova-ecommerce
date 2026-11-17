import jwt from "jsonwebtoken";
import UserModel from "../../Model/UserModel.js";
import bcrypt from "bcrypt";

const ChangePassword = async (req, res) => {
  try {
    const { id, token } = req?.params;
    const { password } = req?.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    const JSON_SECRET_KEY = process.env.JSON_SECRET_KEY;
    let decoded;
    try {
      decoded = jwt.verify(token, JSON_SECRET_KEY);
    } catch {
      return res.status(401).json({
        message: "Reset link has expired or is invalid. Please request a new one.",
        success: false,
      });
    }

    if (decoded?.id && decoded.id !== id) {
      return res.status(401).json({
        message: "Token does not match this user.",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("ChangePassword error:", error?.message || error);
    return res.status(500).json({
      message: error?.message || "Failed to update password",
      success: false,
    });
  }
};

export default ChangePassword;