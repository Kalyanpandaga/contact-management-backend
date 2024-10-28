import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PUT(req, { params }) {
  const { id } = params;
  const { name, email, phoneNumber, address, timezone } = await req.json();

  // Filter out fields that are undefined
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phoneNumber) updateData.phone = phoneNumber;
  if (address) updateData.address = address;
  if (timezone) updateData.timezone = timezone;
  
  // Check if updateData is empty
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ message: 'At least one field must be provided to update.' }, { status: 400 });
  }

  try {
    const updatedContact = await prisma.contact.update({
      where: { id: id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating contact.' }, { status: 500 });
  }
}
