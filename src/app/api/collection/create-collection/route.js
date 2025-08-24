import connectDb from "../../../../../config/connectDb";
import Collection from "../../../../../models/collectionModel";
import authMiddleware from "../../../../../controller/authController";
export async function POST(request) {
    const {searchParams}=new URL(request.url)
    const token=searchParams.get("token") || ""
    const body=await request.json()
    try {
        await connectDb()
        await authMiddleware(token)
        // Ensure indexes reflect latest schema (drops stale unique indexes like collections.handle)
        try { await Collection.syncIndexes(); } catch(e) { /* noop */ }
        if(!body || Object.keys(body).length===0){
            return Response.json({success:false,message:"Invalid payload"},{status:400})
        }
        // Sanitize nested collections handles: remove null/empty to avoid unique collisions
        if(Array.isArray(body.collections)){
            body.collections = body.collections.map((c)=>{
                const clone = { ...c };
                if(!clone?.handle){
                    delete clone.handle;
                }
                return clone;
            })
        }
        // Ensure top-level handle exists; generate from title if missing
        if(!body.handle){
            const base = String(body.title || "collection").toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
            body.handle = `${base}-${Date.now().toString(36)}`;
        }
        const data=await Collection.create(body)
        if(data){
            return Response.json(data,{status:201})
        } else {
            return Response.json({success:false,message:"Unable to create collection"},{status:400})
        }
    } catch (error) {
        // Duplicate key error (e.g., unique handle)
        if(error && (error.code===11000 || error.name==="MongoServerError")){
            return Response.json({success:false,message:"Duplicate value for a unique field", keyValue:error.keyValue},{status:409})
        }
        return Response.json({success:false,message: error?.message || "Server Error"},{status:500})   
    }
  }