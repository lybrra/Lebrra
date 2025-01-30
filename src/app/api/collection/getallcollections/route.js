import connectDb from "../../../../../config/connectDb";
import Collection from "../../../../../models/collectionModel";
import Product from "../../../../../models/productModel";
export async function GET(request) {
    try {
        await connectDb();
        let collectionsWithProductCount = ""
                    const collections = await Collection.find();
                    collectionsWithProductCount = await Promise.all(
                        collections.map(async (collection) => {
                            const productCount = await Product.countDocuments({ collectionName: collection.title });
                            return { ...collection.toObject(), productCount }
                        }))

        return Response.json(collectionsWithProductCount)
        

    } catch (error) {
        console.error("Error fetching collections:", error.message);
        return new Response(
            JSON.stringify({ success: false, error: "Failed to fetch collection" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
