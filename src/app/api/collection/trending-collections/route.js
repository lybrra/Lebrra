import connectDb from "../../../../../config/connectDb";
import Product from "../../../../../models/productModel";
import Collection from "../../../../../models/collectionModel";

export async function GET(request) {
    try {
        await connectDb();
        let collectionsWithProducts = ""

        const mensFeatured = await Collection.find({isFeatured:true});
        collectionsWithProducts = await Promise.all(
            mensFeatured.map(async (collection) => {
                const mensFeaturedPrdts = mensFeatured.length > 0 ? await Product.find({ collectionName: collection?.title,state: "active" }).sort({ createdAt: -1 }).limit(4) : [];
                            return { ...collection.toObject(), mensFeaturedPrdts }
                        }))
        
        return new Response(
            JSON.stringify({
                success: true,
                   collectionsWithProducts
                
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

    } catch (error) {
        console.error("Error fetching collection by handle:", error.message);
        return new Response(
            JSON.stringify({ success: false, error: "Failed to fetch collection" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
