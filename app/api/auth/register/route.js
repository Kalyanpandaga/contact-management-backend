import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { sendEmail } from '../../../utils/sendEmail';
import { userRegistrationSchema } from '@/app/validators/userValidator';

const isEmailRegistered = async (email) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  return !!existingUser;
};

export async function POST(req) {
  const body = await req.json();

  const { error } = userRegistrationSchema.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { name, email, password } = body;
  
  if (await isEmailRegistered(email)) {
    return NextResponse.json({ message: 'Email is already registered' }, { status: 400 });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.userOtp.create({
      data: {
        otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
        userId: newUser.user_id,
      },
    });

    await sendEmail(email, 'Verify your email', `Your verification OTP is ${otp}`);

    return NextResponse.json(
      {
        message: "user registered successfully. Check email for verification OTP."
      }, 
      { 
        status: 201 
      }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
