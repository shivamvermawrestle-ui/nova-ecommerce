import UserModel from "../../Model/UserModel.js"

const AllUsers = async (req, res) => {
  try {
    const admin = await UserModel.findById(req.userId).select("role")

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view users.",
      })
    }

    const allUsers = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: allUsers,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not fetch users.",
    })
  }
}

export default AllUsers