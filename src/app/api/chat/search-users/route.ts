import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/app/lib/db';

export async function GET(req: NextRequest) {
    await connectToDatabase();
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');
        const currentUser = searchParams.get('currentUser');
        
        if (!username) {
            return NextResponse.json({ error: 'Username query parameter is required' }, { status: 400 });
        }
        
        const currentUserDoc = await User.findOne({ username: currentUser });
        const users = await User.find({
            username: { $regex: username, $options: 'i' },
            _id: { $ne: currentUserDoc?._id, $nin: currentUserDoc?.friends || [] }
        }).select('username _id');

        const transformedUsers = users.map(user => ({
            id: user._id.toString(),
            name: user.username,
            status: 'offline',
            lastMessage: '',
            avatar: '',
            unread: 0
        }));

        return NextResponse.json(transformedUsers, { status: 200 });
    } catch (error) {
        console.error('Error during user search:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}