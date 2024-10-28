import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { refreshToken } = await req.json();
  
  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token is required' }, { status: 403 });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
  }
}
