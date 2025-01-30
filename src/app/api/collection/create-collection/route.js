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
                const data=await Collection.create(body)
                if(data!==""){
                    return Response.json(data)
                }
    } catch (error) {
        return Response.json({success:false,message:error},{status:500})   
    }
  }