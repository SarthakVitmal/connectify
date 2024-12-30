import { NextResponse } from 'next/server'
import User from '@/models/User'
import { connectToDatabase } from '../../../lib/db'
export async function POST(req:Request){
    try {
        await connectToDatabase();
        const {email, token} = await req.json()
        console.log(token);
        const user = await User.findOne({verificationToken: token,verificationTokenExpiration: {$gt: Date.now()}});
        if(!user){
            return NextResponse.json({message: 'Invalid token'}, {status: 400});
        }
        if(user.isVerified){
            return NextResponse.json({message: 'Email already verified'}, {status: 400});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiration = undefined;
        await user.save();
        return NextResponse.json({message: 'Email verified successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'An error occurred during email verification. Please try again later.'}, {status: 500}); 
    }
}