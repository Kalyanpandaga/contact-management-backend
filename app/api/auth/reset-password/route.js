import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { resetPasswordSchema } from '@/app/validators/passwordValidator';

export async function POST(req) {
  const body = await req.json();

  const { error } = resetPasswordSchema.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { email, otp, newPassword } = body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: 'Email not found' }, { status: 404 });

    const userOtp = await prisma.userOtp.findFirst({
      where: {
        userId: user.user_id,
        type: 'FORGET_PASSWORD', // Use a constant or enum if possible
      },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!userOtp || userOtp.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }
    
    if (userOtp.expiresAt < new Date()) {
      return NextResponse.json({ message: 'OTP expired' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
