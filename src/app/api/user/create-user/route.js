import connectDb from "../../../../../config/connectDb";
import User from "../../../../../models/userModel";

export async function POST(req){
    const {firstname,lastname,email,mobile,password} = await req.json()
    try{
        await connectDb()
        const user=await User.findOne({email})
        if(user){
            return Response.json({msg:"User Already Exist"},{status:400})
        }
        else{
            const user1 = await User.create({firstname,lastname,email,mobile,password})
            if(user1){
            return Response.json({msg:"User Created"})

            }
        }

    }
    catch(e){
        return Response.json({msg:"Unable to create User"},{status:500})
    }
}
