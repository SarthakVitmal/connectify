import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token');
    let tokenData = null;

    if (token) {
        try {
            tokenData = jwt.decode(token.value);
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }

    const isPublicPath = path === '/' || 
                        path === '/login' || 
                        path === '/signup' || 
                        path === '/verifyemail' || 
                        path === '/forgotpassword' || 
                        path === '/resetpassword';

    const isPrivatePath = path.startsWith('/chat/');
    const urlUsername = path.split('/')[2]; 

    if (isPrivatePath && !tokenData) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // @ts-ignore
    if (isPrivatePath && tokenData && urlUsername && tokenData.username !== urlUsername) {
    // @ts-ignore
        return NextResponse.redirect(new URL(`/chat/${tokenData.username}`, request.url));
    }

    if (isPublicPath && tokenData) {
    // @ts-ignore
        return NextResponse.redirect(new URL(`/chat/${tokenData.username}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/verifyemail',
        '/chat/:path*', 
        '/forgotpassword',
        '/resetpassword'
    ]
};