import connectDb from "../../../../../config/connectDb";
import Product from "../../../../../models/productModel";
import Collection from "../../../../../models/collectionModel";
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
        
        if (collectionsWithProductCount !== "") {
            return Response.json(collectionsWithProductCount)
        }
        else {
            return Response.json({ state: 400, message: "Unable to fetch collections" })
        }





    } catch (error) {
        console.error("Error fetching collections:", error.message);
        return new Response.json({ status: 500, success: false, error: "Failed to fetch collection" })
    }
}
