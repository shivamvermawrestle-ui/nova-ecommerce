import UserModel from "../Model/UserModel.js";

const uploadProductPermission = async (userId) => {
  const user = await UserModel.findById(userId);
  if (user?.role === "ADMIN" || user?.role === "FARMER") {
    return true;
  }
  return false;
};

export default uploadProductPermission;
