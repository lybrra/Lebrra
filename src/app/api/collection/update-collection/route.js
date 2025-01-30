import connectDb from "../../../../../config/connectDb";
import Collection from "../../../../../models/collectionModel";
import authMiddleware from "../../../../../controller/authController";

export async function PUT(request) {
    const {searchParams}=new URL(request.url)
    const id=searchParams.get("id") || ""
    const token=searchParams.get("token") || ""

    const body=await request.json()
    try {
        await connectDb()
        await authMiddleware(token)
      
                    const data=await Collection.findByIdAndUpdate(id, body, {
                        new: true,
                      });
            
                    return Response.json(data)
                
    } catch (error) {
        console.log(error)
        return Response.json({success:false,message:error},{status:500})   
    }
  }