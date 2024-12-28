import { NextResponse } from 'next/server';
import { signOut } from 'next-auth/react';

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL('/login', req.url));
  response.cookies.delete('next-auth.session-token');
  response.cookies.delete('next-auth.csrf-token');
  response.cookies.delete('next-auth.callback-url');
  response.cookies.delete('token');
  
  return response;
}

const handleLogout = async () => {
  await signOut({ redirect: true, callbackUrl: '/login' });
};