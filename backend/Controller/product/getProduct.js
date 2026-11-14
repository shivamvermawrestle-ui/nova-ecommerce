import ProductModel from "../../Model/productModel.js";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sortOptions = {
  newest: { createdAt: -1 },
  "price-low": { sellingPrice: 1 },
  "price-high": { sellingPrice: -1 },
  "name-asc": { productName: 1 },
};

const GetProduct = async (req, res) => {
  try {
    const usesListingParams = [
      "page",
      "limit",
      "search",
      "category",
      "sort",
      "featured"
    ].some((key) => req.query[key] !== undefined);

    // Admin product table ke existing unpaginated request ko support karta hai.
    if (!usesListingParams) {
      const products = await ProductModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        message: "All products",
        success: true,
        data: products,
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

    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();
    const sortBy = String(req.query.sort || "newest");

    const filter = {};

    if (search) {
      filter.productName = {
        $regex: escapeRegex(search),
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }
if(req.query.featured === "true"){
  filter.isFeatured=true;
}
    const [products, totalProducts] = await Promise.all([
      ProductModel.find(filter)
        .sort(sortOptions[sortBy] || sortOptions.newest)
        .skip((page - 1) * limit)
        .limit(limit),
      ProductModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Products loaded",
      success: true,
      data: products,
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
