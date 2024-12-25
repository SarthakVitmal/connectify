import { NextResponse ,NextRequest } from 'next/server';
import passport from 'passport';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/db'

export async function POST(request:NextRequest){
  try {
    await connectToDatabase();  
      const reqBody = await request.json();
      const {email,password} = reqBody;
      console.log(reqBody)

      //Check if user exists
      const user = await User.findOne({email:email})
      if(!user){
          return NextResponse.json({error:"User does not exist"},{status:500})
      }
      //Check if password is correct
      const validPassword = await bcryptjs.compare(password,user.password)
      if(!validPassword){
          return NextResponse.json({error:"Invalid Password"},{status:400})
      }

      //create token data
      const tokenData = {
          id:user._id,
          username:user.username,
          email:user.email,
      }

      const token = jwt.sign(tokenData,process.env.JWT_SECRET!,{expiresIn:"1h"})
      
      const response = NextResponse.json({message:"Login Successful",success:true})
      response.cookies.set('token',token,{httpOnly:true})
      return response;
  } catch (error:any) {
      return NextResponse.json({message:"An error occured duing login. Please try again later."},{status:500})
  }
}