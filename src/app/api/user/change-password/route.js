import connectDb from "../../../../../config/connectDb";
import User from "../../../../../models/userModel";
import jwt from "jsonwebtoken";

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";

  try {
    await connectDb();

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmNewPassword } = body || {};

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return Response.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded?.id);
    if (!user || user.role !== "admin") {
      return Response.json({ message: "Not Authorized" }, { status: 403 });
    }

    const isMatch = await user.isPasswordMatched(currentPassword);
    if (!isMatch) {
      return Response.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    return Response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


