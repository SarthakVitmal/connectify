import { NextResponse } from 'next/server'
import User from '@/models/User'
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/db'
import { sendMail } from '@/helper/mailer';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { username, email, password } = await req.json()
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: `User already exists with this email` }, 
                { status: 400 }
            );
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        try {
            await sendMail(email, 'VERIFY', savedUser._id);
            return NextResponse.json(
                { message: 'User registered successfully' }, 
                { status: 201 }
            );
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json(
                { 
                    message: 'User registered successfully, but verification email could not be sent. Please contact support.',
                    warning: true 
                }, 
                { status: 201 }
            );
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        return NextResponse.json(
            { message: 'An error occurred during registration. Please try again later.' },
            { status: 500 }
        );
    }
}