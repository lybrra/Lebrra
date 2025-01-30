import Product from "../../../../../models/productModel";
import connectDb from "../../../../../config/connectDb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    // Connect to the database
    await connectDb();

    // Extract query parameters
    const search = searchParams.get("search");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const brand = searchParams.get("brand");
    const limit = searchParams.get("limit") || 16;

    const sort = searchParams.get("sort"); // New sort parameter
    const page = parseInt(searchParams.get("page")) || 1;

    if (!search) {
      return Response.json(
        { success: false, error: "Search query is required" },
        { status: 400 }
      );
    }

    // Construct initial search filters
    const searchKeywords = search
      .toLowerCase()
      .split(" ")
      .filter(Boolean);

    const baseQuery = {
      $and: searchKeywords.map((keyword) => ({
        $or: [
          { title: { $regex: new RegExp(keyword, "i") } },
          { sku: { $regex: new RegExp(`^${keyword}$`, 'i') } },
          { category: { $regex: new RegExp(keyword, "i") } },
          { brand: { $regex: new RegExp(keyword, "i") } },
          { collectionName: { $regex: new RegExp(keyword, "i") } },
        ],
      })),
    };

    // Fetch initial results for filters
    const initialResults = await Product.find(baseQuery);

    // Extract filters from the initial results
    const initialBrands = [...new Set(initialResults.map((p) => p.brand))];
    const initialColors = [
      ...new Set(initialResults.flatMap((p) => p.variants.map((v) => v.color))),
    ];
    const initialSizes = [
      ...new Set(initialResults.flatMap((p) => p.variants.map((v) => v.size))),
    ];

    // Apply additional filters if provided
    const filteredQuery = { ...baseQuery };
    filteredQuery.$and.push({ state: "active" });
    if (brand) {
      filteredQuery.$and.push({ brand: { $regex: new RegExp(brand, "i") } });
    }
    if (color) {
      filteredQuery.$and.push({ "variants.color": { $regex: new RegExp(color, "i") } });
    }
    if (size) {
      filteredQuery.$and.push({ "variants.size": { $regex: new RegExp(size, "i") } });
    }

    // Define sort criteria based on the `sort` query parameter
    let sortCriteria = { createdAt: -1 }; // Default: Most recently created products
    if (sort) {
      switch (sort.toLowerCase()) {
        case "price":
          sortCriteria = { price: 1 }; // Sort by price low to high
          break;
        case "-price":
          sortCriteria = { price: -1 }; // Sort by price high to low
          break;
        case "title":
          sortCriteria = { title: 1 }; // Sort alphabetically A-Z
          break;
        case "-title":
          sortCriteria = { title: -1 }; // Sort alphabetically Z-A
          break;
        case "sold":
          sortCriteria = { sold: -1 }; // Sort by most sold
          break;
        case "-sold":
          sortCriteria = { sold: 1 }; // Sort by least sold
          break;
        default:
          sortCriteria = { createdAt: -1 }; // Default fallback
      }
    }

    // Paginate the filtered results
    const filteredProducts = await Product.find(filteredQuery)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filteredQuery);
    const totalPages = Math.ceil(totalProducts / limit);

    // Response
    return Response.json(
      {
        success: true,
        products: filteredProducts,
        filters: {
          brands: initialBrands,
          colors: initialColors,
          sizes: initialSizes,
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
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
