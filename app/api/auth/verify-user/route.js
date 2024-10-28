// app/api/auth/verify-user/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  const { email, otp } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });


    const userOtp = await prisma.userOtp.findFirst({
      where: {
        userId: user.user_id,
        type: 'EMAIL_VERIFICATION', 
      },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!userOtp || userOtp.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }
    
    if (userOtp.expiresAt < new Date()) {
      return NextResponse.json({ message: 'OTP expired' }, { status: 400 });
    }

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { isVerified: true },
    });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
