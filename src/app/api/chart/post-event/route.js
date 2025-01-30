import connectDb from "../../../../../config/connectDb"
import Events from "../../../../../models/eventsModel"
export async function POST(request){
const {searchParams}=new URL(request.url)
const event=searchParams.get("event") || ""
try{
    if(!event){
    return Response.json({success:false,message:"Missing Details"},{status:400})
    }
    await connectDb()
    const location=await Events.create({event})
    if(location){
    return Response.json({success:true,message:"Event Created"},{status:200})

    }
}
catch(err){
    return Response.json({success:false,message:err},{status:500})
}

}