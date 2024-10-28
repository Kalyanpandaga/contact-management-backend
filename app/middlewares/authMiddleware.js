
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; 

export async function authMiddleware(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Access token missing' }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    req.user = payload;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: error.message.includes('JWTExpired') ? 'Token expired' : 'Invalid token' }, { status: 403 });
  }
}


