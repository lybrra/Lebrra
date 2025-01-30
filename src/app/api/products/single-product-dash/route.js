import Product from "../../../../../models/productModel";
import connectDb from "../../../../../config/connectDb";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try{
    await connectDb()
    let id;
    if (searchParams.get("productHandle")) {
        id = searchParams.get("productHandle");
      }

      const product=await Product.findById(id)
      return Response.json(
        {
          success: true,
          product
        },
        { status: 200 }
      );

  }
  catch (error) {
    console.error("Error fetching product:", error.message);
    return Response.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }

}