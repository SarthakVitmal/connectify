import nodemailer from 'nodemailer';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const sendMail = async (email: string, emailType: string, userId: string) => {
   try {
    const token = await bcrypt.hash(userId.toString(), 12);
    if(emailType === "VERIFY"){
        await User.findOneAndUpdate({_id: userId}, {
            verificationToken: token,
            verificationTokenExpiration: Date.now() + 3600000
        })
    }
    else if(emailType === "FORGOT"){
        await User.findOneAndUpdate({_id: userId}, {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiration: Date.now() + 3600000
    })
}
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.SEND_EMAIL_USER,
            pass: process.env.SEND_EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.SEND_EMAIL_USER,
        to: email,
        subject: emailType === "VERIFY" ? "Verify your email - Connectify" : "Reset your password - Connectify",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${emailType === "VERIFY" ? "Email Verification" : "Password Reset"} - Connectify</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #ffffff;
                        padding: 20px;
                        text-align: center;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: teal;
                    }
                    .content {
                        background-color: #ffffff;
                        padding: 30px;
                        text-align: center;
                    }
                    h1 {
                        color: #333333;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666666;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }
                    .button {
                        display: inline-block;
                        background: teal;
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        transition: all 0.3s ease;
                    }
                    .button:hover {
                        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }
                    .footer {
                        background-color: #f8f8f8;
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Connectify</div>
                    </div>
                    <div class="content">
                        <h1>${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}</h1>
                        <p>Hello,</p>
                        <p>${emailType === "VERIFY" 
                            ? "Thank you for joining Connectify! To complete your registration and verify your email address, please click the button below:" 
                            : "We received a request to reset your password. If you didn't make this request, you can ignore this email. Otherwise, click the button below to reset your password:"
                        }</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/${emailType === 'VERIFY' ? `verifyemail?token=${token}` : `resetpassword?token=${token}`}" class="button">
                            ${emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password'}
                        </a>
                        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                        <p>${process.env.NEXT_PUBLIC_APP_URL}/${emailType === 'VERIFY' ? `verifyemail?token=${token}` : `resetpassword?token=${token}`}</p>
                        <p>This link will expire in 1 hour for security reasons.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Connectify. All rights reserved.</p>
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

