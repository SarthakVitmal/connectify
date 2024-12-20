import {NextResponse} from 'next/server'
import User from '@/models/user'
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/db'

export async function POST(req:Request) {
    try {
        const {username, email, password} = await req.json()
        await connectToDatabase();
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred during registration. Please try again later.' },
            { status: 500 }
          )
    }
}