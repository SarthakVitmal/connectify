import {NextResponse,NextRequest} from 'next/server'

export function middleware(request:NextRequest){
    const path = request.nextUrl.pathname;
    const isPublicPath = path == '/' || path == '/verifyemail' || path == '/forgotpassword' || path == '/resetpassword' ;
    const isPrivatePath = path == '/chat' || path == '/login' || path == '/signup';
    const token = request.cookies.get('token');
    const hasValidQuery = request.nextUrl.searchParams.get('token'); // Example check for a valid token in query params

    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/chat',request.nextUrl));
    }
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/',request.nextUrl));
    }
    if (isPrivatePath && (!hasValidQuery || !token)) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
      }
    if(isPrivatePath && !token){
        return NextResponse.redirect(new URL('/',request.nextUrl));
    }
    return NextResponse.next();
}

export const config = {
    matcher:[
        '/',
        '/login',
        '/signup',
        '/verifyemail',
        '/chat',
        '/forgotpassword',
        '/resetpassword'
    ]
}