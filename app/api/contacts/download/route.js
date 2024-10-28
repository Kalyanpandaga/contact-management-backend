// api/contacts/downloadContacts.js

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { generateCSVBuffer } from '@/app/utils/fileParser';


export const GET = async () => {

    
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        isDeleted: false,
      },
      select: { name: true, email: true, phone: true, address: true, timezone: true, createdAt: true, updatedAt: true },
    });

    const csvBuffer = generateCSVBuffer(contacts);

    return new Response(csvBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="contacts.csv"',
        'Content-Type': 'text/csv',
      },
    });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error generating file.' }, { status: 500 });
  }
};
