// app/api/chat/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase} from '@/../../src/app/lib/db'
import Message from '@/models/Message';
import User from '@/models/User';
import { getDataFromToken } from '@/helper/getDataFromToken';

connectToDatabase();

export async function POST(request: NextRequest) {
    try {
        // Get sender ID from token
        const senderId = await getDataFromToken(request);
        if (!senderId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Get message content from request
        const { content } = await request.json();
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Find or create system user for global chat
        let systemUser = await User.findOne({ username: 'system' });
        if (!systemUser) {
            systemUser = await User.create({
                username: 'system',
                email: 'system@connectify.com',
                password: 'systemuser' // You might want to handle this differently
            });
        }

        // Create message
        const message = await Message.create({
            content,
            senderId,
            receiverId: systemUser._id,
            channel: 'global'
        });

        // Populate sender and receiver details
        const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'username')
            .populate('receiverId', 'username');

        return NextResponse.json({
            message: "Message sent successfully",
            data: populatedMessage
        });

    } catch (error: any) {
        console.error("Error in POST /api/chat/messages:", error);
        return NextResponse.json(
            { error: "Internal server error: " + error.message }, 
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const messages = await Message.find({ channel: 'global' })
            .populate('senderId', 'username')
            .populate('receiverId', 'username')
            .sort({ timestamp: -1 })
            .limit(50);
            
        return NextResponse.json({
            messages: messages.reverse()
        });
    } catch (error: any) {
        console.error("Error in GET /api/chat/messages:", error);
        return NextResponse.json(
            { error: "Internal server error: " + error.message }, 
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest,response:NextResponse) {
    if(request.method === 'DELETE') {
    try {
        const user_id = await getDataFromToken(request);
        const { searchParams } = new URL(request.url);
        const message_id = searchParams.get('message_id');

        const deleteMessage = await Message.findOneAndDelete({ _id: message_id, senderId: user_id });
        if (!deleteMessage) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }
        else return NextResponse.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.log(error)
    }
}
}