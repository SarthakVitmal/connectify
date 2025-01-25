// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/app/lib/db";
// import User from "@/models/User";
// import Message from "@/models/Message";

// // Handle GET requests
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");

//   if (!userId) {
//     return NextResponse.json({ error: "User ID is required." }, { status: 400 });
//   }

//   try {
//     await connectToDatabase();

//     const user = await User.findById(userId).populate("friends");
//     if (!user) {
//       return NextResponse.json({ error: "User not found." }, { status: 404 });
//     }

//     const chats = await Message.find({
//       participants: { $in: [userId, ...user.friends.map((friend: any) => friend._id)] },
//     }).populate("participants", "username email");

//     return NextResponse.json({ chats }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching chats:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Find the user and populate their friends
    const user = await User.findById(userId).populate({
      path: "friends",
      select: "username status avatar isVerified _id"
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Transform friends data into the expected format
    const friendsList = user.friends.map((friend: any) => ({
      _id: friend._id,
      username: friend.username,
      status: friend.status || "offline",
      avatar: friend.avatar || "",
      isVerified: friend.isVerified || false
    }));

    return NextResponse.json({ friends: friendsList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}