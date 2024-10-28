import { prisma } from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedContact = await prisma.contact.update({
      where: { id: id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: 'Contact deleted successfully.', contact: deletedContact }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting contact.' }, { status: 500 });
  }
}