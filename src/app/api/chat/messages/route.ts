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
            .limit(50)
            .lean();
            
        const transformedMessages = messages.reverse().map(msg => {
            if (!msg || !msg.senderId || !msg.receiverId) {
                console.error('Invalid message data:', msg);
                return null;
            }

            // Safely access nested properties
            const senderData = msg.senderId && typeof msg.senderId === 'object' 
                ? msg.senderId 
                : { _id: msg.senderId, username: 'Unknown' };

            const receiverData = msg.receiverId && typeof msg.receiverId === 'object'
                ? msg.receiverId
                : { _id: msg.receiverId, username: 'Unknown' };

            return {
                _id: msg._id?.toString() || 'unknown',
                content: msg.content || '',
                senderId: {
                    _id: senderData._id?.toString() || 'unknown',
                    username: senderData.username || 'Unknown'
                },
                receiverId: {
                    _id: receiverData._id?.toString() || 'unknown',
                    username: receiverData.username || 'Unknown'
                },
                timestamp: msg.createdAt || msg.timestamp || new Date(),
                isRead: Boolean(msg.isRead)
            };
        }).filter(Boolean); // Remove any null messages

        return NextResponse.json({
            success: true,
            messages: transformedMessages
        });
    } catch (error: any) {
        console.error("Error in GET /api/chat/messages:", error);
        return NextResponse.json({ 
            success: false,
            error: "Internal server error: " + error.message 
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if(request.method === 'DELETE') {
    try {
        const user_id = await getDataFromToken(request);
        if (!user_id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }
        const { searchParams } = new URL(request.url);
        const message_id = searchParams.get('message_id');
        if (!message_id) {
            return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
          }
        const deleteMessage = await Message.findOneAndDelete({ _id: message_id, senderId: user_id });
        if (!deleteMessage) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }
        else return NextResponse.json({ message: "Message deleted successfully" });
    } catch (error:any) {
        return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 });
    }
}
}