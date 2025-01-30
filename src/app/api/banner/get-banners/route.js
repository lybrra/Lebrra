import connectDb from "../../../../../config/connectDb"
import Banner from "../../../../../models/bannersModel"
export async function GET(){
    try{
await connectDb()
const banners=await Banner.find()
return Response.json(banners)
    }
    catch(error){
        return Response.json({status:500,message:error})
    }
}