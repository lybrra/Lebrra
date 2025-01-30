import connectDb from "../../../../../config/connectDb"
import authMiddleware from "../../../../../controller/authController"
import Scroll from "../../../../../models/bannersModel"
export async function POST(req){
    const {searchParams}=new URL(req.url)
    const token=searchParams.get("token")
    const body=await req.json()
    try{
        await connectDb()
        await authMiddleware(token)
        const scroll=await Scroll.create(body)
        if(scroll){
            return Response.json(scroll)
        }

    }catch(error){
        return Response.json({success:false,message:error},{status:500})
    }
}