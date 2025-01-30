import connectDb from "../../../../../config/connectDb";
import authMiddleware from "../../../../../controller/authController";
import Coupon from "../../../../../models/couponModel";

export async function PUT(request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id") || ""
    const token = searchParams.get("token") || ""

    const body = await request.json()
    try {
        await connectDb()
        await authMiddleware(token)

        const data=await Coupon.findByIdAndUpdate(id, body, {
            new: true,
        });

        if (data) {
            return Response.json(data)
        }
    } catch (error) {
        return Response.json({ success: false, error: "Failed to update coupon" },
            { status: 500 })
    }
}