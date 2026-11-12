import uploadProductPermission from "../../helper/permission.js";
import ProductModel from "../../Model/productModel.js";

const UpdateProduct = async (req, res) => {
  try {
    const hasPermission = await uploadProductPermission(req.userId);
    if (!hasPermission) {
      throw new Error("Permission denied");
    }
    const { _id, ...resBody } = req.body;
    const updateProduct = await ProductModel.findByIdAndUpdate(_id, resBody, { new: true ,runValidators:true });
    res.status(200).json({
      message: "Product Updated Successfully",
      success: true,
      data: updateProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      success: false,
    });
  }
};

export default UpdateProduct;
