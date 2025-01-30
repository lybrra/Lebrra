import Product from "../../../../models/productModel";
import connectDb from "../../../../config/connectDb";
import Collection from "../../../../models/collectionModel";
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    await connectDb();

    let query = {};
    query.state = searchParams.get("state") || "active";

    // Filtering by collectionHandle
    if (searchParams.get("collectionName")) {
      query.collectionName = searchParams.get("collectionName");
    }

    // Size filtering
    if (searchParams.get("size")) {
      const sizes = searchParams
        .get("size")
        .split(",")
        .map((size) => size.trim());
      query["variants"] = {
        $elemMatch: {
          size: { $in: sizes },
          quantity: { $gt: 0 },
        },
      };
    }

    // Color filtering
    if (searchParams.get("color")) {
      const colors = searchParams
        .get("color")
        .split(",")
        .map((color) => new RegExp(color.trim(), "i"));
      query["variants.color"] = { $in: colors };
    }
    // Brand filtering (convert to lowercase)
    if (searchParams.get("brand")) {
      const brands = searchParams
        .get("brand")
        .split(",")
        .map((brand) => brand.trim().toLowerCase());
      query["$expr"] = {
        $in: [
          { $toLower: "$brand" }, // Convert brand field in DB to lowercase
          brands,                 // Array of input brands
        ],
      };
    }
    if (searchParams.get("collectionName")) {
      const collectionNames = searchParams
        .get("collectionName")
        .split(",")
        .map((name) => name.trim());
    
      query["collectionName"] = { $in: collectionNames };
    }

    // Search functionality
    if (searchParams.get("search")) {
      const searchKeywords = searchParams.get("search").toLowerCase().split(" ");
      const searchConditions = [];

      searchKeywords.forEach((keyword) => {
        let regexPattern;
        if (keyword === "shirt") {
          regexPattern = new RegExp(`^(?!.*t-shirt).*\\b${keyword}\\b.*$`, "i");
        } else if (keyword === "shirts") {
          regexPattern = new RegExp(`\\bshirt\\b`, "i");
        } else if (["tshirt", "tshirts", "t-shirts"].includes(keyword)) {
          regexPattern = new RegExp(`\\bt-shirt\\b`, "i");
        } else if (keyword === "shoes") {
          searchConditions.push({
            $or: [
              { title: { $regex: new RegExp("\\bsneakers\\b", "i") } },
              { title: { $regex: new RegExp("\\bloafers\\b", "i") } },
            ],
          });
          return;
        } else {
          regexPattern = new RegExp(`^${keyword}$`, "i");
        }

        if (regexPattern) {
          searchConditions.push({
            $or: [
              { "variants.color": { $regex: regexPattern } },
              { title: { $regex: regexPattern } },
              { brand: { $regex: regexPattern } },
              { sku: { $regex: regexPattern } },
              { "variants.size": { $regex: regexPattern } },
            ],
          });
        }
      });

      if (searchConditions.length > 0) {
        query.$and = searchConditions;
      }
    }

    // Sorting
    const sortQuery = searchParams.get("sort");
    let sortCriteria = { order: 1, createdAt: -1 }; // Default sorting
    if (sortQuery) {
      if (sortQuery === "title") sortCriteria = { title: 1 };
      else if (sortQuery === "-title") sortCriteria = { title: -1 };
      else if (sortQuery === "price") sortCriteria = { price: 1 };
      else if (sortQuery === "-price") sortCriteria = { price: -1 };
    }

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 16;
    const skip = (page - 1) * limit;

    // Total documents count
    const totalDocs = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    // Aggregation pipeline
    let productQuery = Product.aggregate([
      { $match: query },
      { $addFields: { totalQuantity: { $sum: "$variants.quantity" } } },
      {
        $addFields: {
          isSoldOut: {
            $cond: { if: { $eq: ["$totalQuantity", 0] }, then: 1, else: 0 },
          },
        },
      },
      { $sort: { isSoldOut: 1, ...sortCriteria } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Field Projection
    if (searchParams.get("fields")) {
      const fields = searchParams
        .get("fields")
        .split(",")
        .reduce((acc, field) => {
          acc[field.trim()] = 1;
          return acc;
        }, {});
      productQuery = productQuery.project(fields);
    }

    // Fetch products
    const products = await productQuery;

    // Response
    return Response.json(
      {
        success: true,
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalDocs,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return Response.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}