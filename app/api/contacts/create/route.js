
import { contactSchema } from '@/app/validators/contactValidator';
import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

const isEmailExists = async (email) => {
  const existingcontact = await prisma.contact.findUnique({
    where: { email },
  });
  return !!existingcontact;
};

export async function POST(req) {
  const body = await req.json();

  const { error } = contactSchema.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return NextResponse.json({ errors }, { status: 400 });
  }


  const { name, email, phoneNumber, address, timezone } = body;

  if (await isEmailExists(email)) {
    return NextResponse.json({ message: 'This Email is already in existing contacts' }, { status: 400 });
  }

  try {
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        address,
        timezone,
        phone: phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
      },
    });

    return NextResponse.json({contact_id: newContact.id}, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating contact.' }, { status: 500 });
  }
}
