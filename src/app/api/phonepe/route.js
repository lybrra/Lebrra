import Razorpay from "razorpay"
const instancelvl=new Razorpay({
    key_id:process.env.KEY_ID,key_secret:process.env.KEY_SECRET
})

export async function POST(request) {
  const {searchParams}=new URL(request.url)
  const amount=searchParams.get("amount") || 1
  try{
  const option={
      amount:amount*100,
      currency:"INR"
  }
  const order=await instancelvl.orders.create(option)
  if(order){
    return Response.json({
      success:true,
      order
    },{status:200})
  }
 else{
  return Response.json({
    success:false,
    message:"Error in Payment"
  },{status:400})
 }
  }
  catch(error){
    console.log(error)
    return Response.json({
      success:false,
    message:"Error in Payment"
    },{status:500})
  }
}


