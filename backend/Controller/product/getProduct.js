import ProductModel from "../../Model/productModel.js";

const GetProduct = async (req, res) => {
  try {
    const hasPagination =
      req.query.page !== undefined || req.query.limit !== undefined;

 
    if (!hasPagination) {
      const allProduct = await ProductModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        message: "All products",
        success: true,
        data: allProduct,
      });
    }

    const pageInput = Number.parseInt(req.query.page, 10);
    const limitInput = Number.parseInt(req.query.limit, 10);

    const page =
      Number.isSafeInteger(pageInput) && pageInput > 0 ? pageInput : 1;
    const limit =
      Number.isSafeInteger(limitInput) && limitInput > 0
        ? Math.min(limitInput, 50)
        : 12;

    const skip = (page - 1) * limit;

    const [allProduct, totalProducts] = await Promise.all([
      ProductModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ProductModel.countDocuments(),
    ]);

    return res.status(200).json({
      message: "Products loaded",
      success: true,
      data: allProduct,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Could not load products.",
      success: false,
    });
  }
};

export default GetProduct;