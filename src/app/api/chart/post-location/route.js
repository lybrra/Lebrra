import connectDb from "../../../../../config/connectDb"
import Location from "../../../../../models/locationModel"
export async function POST(request){
const {searchParams}=new URL(request.url)
const city=searchParams.get("city") || ""
const state=searchParams.get("state") || ""
try{
    if(!city || !state){
    return Response.json({success:false,message:"Missing Details"},{status:400})
    }
    await connectDb()
    const location=await Location.create({city,state})
    if(location){
    return Response.json({success:true,message:"Location Created"},{status:200})

    }
}
catch(err){
    return Response.json({success:false,message:err},{status:500})
}

}