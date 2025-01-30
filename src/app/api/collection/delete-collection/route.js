import connectDb from "../../../../../config/connectDb";
import Collection from "../../../../../models/collectionModel";
import authMiddleware from "../../../../../controller/authController";

export async function DELETE(request) {
    const {searchParams}=new URL(request.url)
    const id=searchParams.get("id") || ""
    const token=searchParams.get("token") || ""

    try {
        await connectDb()
        await authMiddleware(token)
        
        const data=await Collection.findByIdAndDelete(id)
                if(data!==""){
                    return Response.json(data)
                }
    } catch (error) {
        return Response.json({success:false,message:error},{status:500})   
    }
  }