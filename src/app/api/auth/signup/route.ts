import {NextResponse} from 'next/server'
import User from '@/models/User'
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/db'
import { sendMail } from '@/helper/mailer';

export async function POST(req:Request) {
    try {
        const {username, email, password} = await req.json()
        await connectToDatabase();
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: `User already exists with this email` }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        await sendMail(email, 'VERIFY', savedUser._id);
        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred during registration. Please try again later.' },
            { status: 500 }
          )
    }
}