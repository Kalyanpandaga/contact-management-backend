import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return NextResponse.json({ message: 'Email not Registered' }, { status: 400 });
    if (!user.isVerified) return NextResponse.json({ message: 'Email is not verified' }, { status: 400 });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid Password." }, { status: 400 });
    }

    const accessToken = jwt.sign({ userId: user.user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ userId: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
