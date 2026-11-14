import uploadProductPermission from "../../helper/permission.js";
import ProductModel from "../../Model/productModel.js";

const UploadProduct = async (req, res) => {
  try {
    const hasPermission = await uploadProductPermission(req.userId);

    if (!hasPermission) {
      return res.status(403).json({
        message: "Only an admin or farmer can add products.",
        success: false,
      });
    }

    const uploadProduct = new ProductModel(req.body);
    const saveProduct = await uploadProduct.save();

    return res.status(201).json({
      message: "Product uploaded successfully.",
      success: true,
      data: saveProduct,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Could not save this product.",
      success: false,
    });
  }
};

export default UploadProduct;
