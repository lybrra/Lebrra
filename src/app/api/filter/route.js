import Product from "../../../../models/productModel";
import connectDb from "../../../../config/connectDb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    await connectDb();

    // Fetch collectionHandle from the query string
    const collectionName = searchParams.get("collectionName");
    
    if (!collectionName) {
      return Response.json({ success: false, error: "Collection handle is required" }, { status: 400 });
    }

    // Query to fetch products by collectionHandle and state 'active'
    let query = {
      state: "active",
      collectionName: collectionName,
    };

    // Fetch products from the database
    const products = await Product.find(query).exec();

    if (!products || products.length === 0) {
      return Response.json({ success: false, error: "No products found" }, { status: 404 });
    }

    // Arrays to store unique sizes, colors, and brands
    const uniqueSizes = new Set();
    // const uniqueColors = new Set();
    const uniqueBrands = new Set();
    const uniqueColors = new Set();


    // Loop through products and their variants to collect unique sizes, colors, and brands
    products.forEach((product) => {
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant) => {
          if (variant.size) uniqueSizes.add(variant.size.trim()); // Convert size to lowercase and add unique sizes
          // if (variant.color) uniqueColors.add(variant.color.toLowerCase()); // Convert color to lowercase and add unique colors
        });
      }
    
      if (product.brand) {
        uniqueBrands.add(product.brand.toLowerCase()); // Convert brand to lowercase and add unique brand
      }
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant) => {
          if (variant.color) uniqueColors.add(variant.color.trim()); // Convert size to lowercase and add unique sizes
        });
      }
    });

    // Convert sets to arrays
    const sizes = Array.from(uniqueSizes);
    const colors=Array.from(uniqueColors)
    // const colors = Array.from(uniqueColors);
    const brands = Array.from(uniqueBrands);

    // Response with products and filter arrays
    return Response.json(
      {
        success: true,
        sizes,
        colors,
        brands,
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
