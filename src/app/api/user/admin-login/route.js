import connectDb from "../../../../../config/connectDb";
import User from "../../../../../models/userModel";
import { generateRefreshToken } from "../../../../../config/refreshtoken";
import { generateToken } from "../../../../../config/jwtToken";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;
  try {
    await connectDb();

    // Check if admin exists
    const findAdmin = await User.findOne({ email });
    if (!findAdmin || findAdmin.role !== "admin") {
      return NextResponse.json(
        { message: "Not Authorized" },
        { status: 401 }
      );
    }

    // Validate password
    if (await findAdmin.isPasswordMatched(password)) {
      const refreshToken = await generateRefreshToken(findAdmin._id);

      // Update user with refresh token
      await User.findByIdAndUpdate(
        findAdmin.id,
        { refreshToken },
        { new: true }
      );

      // Create response with cookie
      const response = NextResponse.json({
        _id: findAdmin._id,
        firstname: findAdmin.firstname,
        lastname: findAdmin.lastname,
        email: findAdmin.email,
        mobile: findAdmin.mobile,
        image: findAdmin.image,
        role:findAdmin.role,
        token: generateToken(findAdmin._id),
      });

      // Set refresh token as HTTP-only cookie
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 72 hours
        path: "/",
        sameSite: "strict",
      });

      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error Login Admin:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
