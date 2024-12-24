import nodemailer from 'nodemailer';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const sendMail = async (email: string, emailType: string, userId: string) => {
   try {
    const token = await bcrypt.hash(userId.toString(), 12);
    if(emailType == "VERIFY"){
        await User.findOneAndUpdate({_id: userId}, {
            verificationToken: token,
            verificationTokenExpiration: Date.now() + 3600000
        })
    }
    const transporter = nodemailer.createTransport({
        host:"sandbox.smtp.mailtrap.io",
        port:2525,
        auth:{
            user: process.env.SEND_EMAIL_USER,
            pass: process.env.SEND_EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.SEND_EMAIL_USER,
        to: email,
        subject: 'Email Verification - Action Required',
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f9;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #4CAF50;
                            text-align: center;
                        }
                        .content {
                            text-align: center;
                            padding: 20px;
                        }
                        .button {
                            display: inline-block;
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            font-size: 16px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #888;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Email Verification</h1>
                        <div class="content">
                            <p>Hi there,</p>
                            <p>Thank you for registering with us. To complete your registration and verify your email address, please click the button below:</p>
                            <a href="http://localhost:3000/verifyemail?token=${token}" class="button">Verify Email</a>
                            <p>If you did not request this, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>Best regards, <br/> The Team</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
   } catch (error) {
        return NextResponse.json('Error sending email', {status: 500});
   }    
}