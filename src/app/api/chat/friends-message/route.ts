import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@//app/lib/db';
import Message from '@//models/Message';
import User from '@//models/User';
import mongoose from 'mongoose';
import { getDataFromToken } from '@//helper/getDataFromToken';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    // If userId is provided, fetch friends list
    if (userId && !senderId && !receiverId) {
      const user = await User.findById(userId).populate('friends');
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          error: "User not found" 
        }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true,
        friends: user.friends || []
      });
    }

    // Handle message fetching between two users
    if (senderId && receiverId) {
      if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid sender or receiver ID" 
        }, { status: 400 });
      }

      const chatId = [senderId.toString(), receiverId.toString()].sort().join('_');
      
      const messages = await Message.find({ chatId })
        .sort({ createdAt: 1 })
        .populate('senderId', 'username')
        .populate('receiverId', 'username')
        .lean();
  
      // Decrypt messages
      const transformedMessages = messages.map((msg: any) => ({
        _id: msg._id.toString(),
        content:(msg.content),
        senderId: {
          _id: msg.senderId._id.toString(),
          username: msg.senderId.username
        },
        receiverId: msg.receiverId._id.toString(),
        timestamp: msg.createdAt || new Date(),
        isRead: Boolean(msg.isRead)
      }));
  
      return NextResponse.json({ 
        success: true,
        messages: transformedMessages
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Invalid request parameters" 
    }, { status: 400 });

  } catch (error: any) {
    console.error("Error in friends-message:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { content, receiverId } = await request.json();
    const senderId = await getDataFromToken(request);

    if (!content || !receiverId || !senderId) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields"
      }, { status: 400 });
    }

    // Generate unique chatId for one-to-one chat
    const chatId = [senderId, receiverId].sort().join('_');

    // Encrypt the message content
    const encryptedContent = (content);

    // Create new message with chatId
    const newMessage = await Message.create({
      chatId,
      content: encryptedContent,
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      isRead: false,
      createdAt: new Date()
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'username')
      .populate('receiverId', 'username')
      .lean();

    return NextResponse.json({
      success: true,
      data: populatedMessage
    });

  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
