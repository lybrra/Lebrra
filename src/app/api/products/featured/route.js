import Product from "../../../../../models/productModel";
import connectDb from "../../../../../config/connectDb";

export async function GET(request) {
  try {
    await connectDb();

    // Fetch featured products
    const featuredProducts = await Product.find({isFeatured:true,state:"active"});
    // Fetch latest products
    const latestProducts = await Product.find({state:"active"}).sort({ createdAt: -1 }).limit(8);

    return Response.json(
      {
        success: true,
        data: {
         featuredProducts,
         latestProducts
        },
      },
      {
        status: 200,
       
      }
    )
    
  } catch (error) {
    console.error("Error fetching featured products:", error.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch products",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
