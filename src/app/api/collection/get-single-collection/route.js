import connectDb from "../../../../../config/connectDb"
import Collection from "../../../../../models/collectionModel"
export async function GET(request){
    const {searchParams}=new URL(request.url)
    const id=searchParams.get("id") || ""
    try{
        await connectDb()
        const data=await Collection.findById(id)
        if(data!==""){
            return Response.json(data)
        }


    }
    catch(error){
        return Response.json({status:500,message:error})
    }
}