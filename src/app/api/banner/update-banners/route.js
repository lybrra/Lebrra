import connectDb from "../../../../../config/connectDb"
import authMiddleware from "../../../../../controller/authController"
import Scroll from "../../../../../models/bannersModel"
export async function PUT(request){
    const {searchParams}=new URL(request.url)
    const body=await request.json()
    const id=searchParams.get("id") ||"" 
    const token=searchParams.get("token") ||"" 
    try{
await connectDb()
await authMiddleware(token)
const banners=await Scroll.findByIdAndUpdate(id, {images:body}, {
    new: true,
  });
return Response.json(banners)
    }
    catch(error){
        return Response.json({success:false,message:error},{status:500})
    }
}