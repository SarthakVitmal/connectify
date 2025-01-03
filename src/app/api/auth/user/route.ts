import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;
connectToDatabase()

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);


    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { _id, username, email } = user;
    return NextResponse.json({ _id, username, email });

  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
