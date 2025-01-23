import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db';
import Friend from '@/models/Friend'; 
import User from '@/models/User';


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, friendId } = await req.json();
    console.log('Received body:', { userId, friendId });  // Log the full body

    if (!userId || !friendId) {
      return NextResponse.json({ error: 'userId and friendId are required' }, { status: 400 });
    }

    const existingFriendship = await Friend.findOne({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    if (existingFriendship) {
      console.log('Friendship already exists');
      return NextResponse.json({ message: 'Friendship already exists' }, { status: 409 });
    }

     // Add friendId to the user's friends array
     await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }, 
      { new: true }
    );

    // Optionally, add userId to the friend's friends array
    await User.findByIdAndUpdate(
      friendId,
      { $addToSet: { friends: userId } },
      { new: true }
    );

    // Create a new friendship document if no existing friendship found
    await Friend.create({ userId, friendId });
    console.log('Friend added successfully');
    return NextResponse.json({ message: 'Friend added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json({ error: 'Failed to add friend' }, { status: 500 });
  }
}
