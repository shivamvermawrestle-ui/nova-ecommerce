import UserModel from "../../Model/UserModel.js"

const UpdateUser = async (req, res) => {
  try {
    const admin = await UserModel.findById(req.userId).select("role")

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update users.",
      })
    }

    const { userId, name, email, role } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      })
    }

    if (String(userId) === String(req.userId) && role && role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin role.",
      })
    }

    const payload = {}

    if (name !== undefined) payload.name = name.trim()
    if (email !== undefined) payload.email = email.trim().toLowerCase()

    if (role !== undefined) {
      const validRoles = ["ADMIN", "GENERAL", "FARMER"]

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user role.",
        })
      }

      payload.role = role
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No user fields provided to update.",
      })
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Could not update user.",
    })
  }
}

export default UpdateUser