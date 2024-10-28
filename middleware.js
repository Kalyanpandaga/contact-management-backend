
import { NextResponse } from 'next/server';
import { authMiddleware } from './app/middlewares/authMiddleware';


export function middleware(req) {
  const authResponse = authMiddleware(req);
  if (authResponse) return authResponse;

  return NextResponse.next(); 
}

export const config = {
  matcher: ['/api/contacts:path*'], 
};
