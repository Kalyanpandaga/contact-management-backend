import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { sendEmail } from '../../../utils/sendEmail';

export async function POST(req) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.userOtp.create({
      data: {
        otp,
        type: 'FORGET_PASSWORD',
        expiresAt,
        userId: user.user_id,
      },
    });

    await sendEmail(email, 'Password Reset OTP', `Your password reset OTP is ${otp}`);

    return NextResponse.json({ message: 'OTP sent to your email' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
