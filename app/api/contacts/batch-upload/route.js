// api/contacts/batchUpload.js

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import multer from 'multer';
import { parseCSV, parseExcel } from '@/app/utils/fileParser';

// Set up Multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to handle file uploads
const uploadHandler = upload.single('file');

export const POST = async (req) => {
  console.log("Incoming request:", req);
  
  // Create a promise to handle the file upload
  const uploadPromise = new Promise((resolve, reject) => {
    uploadHandler(req, {}, (err) => {
      if (err) {
        reject(err);
      }
      resolve(req.file);
    });
  });

  let file;
  try {
    file = await uploadPromise;
  } catch (error) {
    return NextResponse.json({ message: 'File upload failed.' }, { status: 500 });
  }

  // Check if the file was uploaded
  if (!file) {
    return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
  }

  const { buffer, mimetype } = file;

  let parsedData;

  // Parse CSV or Excel file
  try {
    parsedData = mimetype === 'text/csv' ? await parseCSV(buffer) : await parseExcel(buffer);
  } catch (error) {
    return NextResponse.json({ message: 'File parsing failed.' }, { status: 400 });
  }

  // Validate and process data
  const errors = [];
  const contactsToProcess = parsedData.map((data) => {
    const { name, email, phone, timezone, id } = data;
    if (!name || !email || !phone || !timezone) {
      errors.push({ message: 'Invalid data format', data });
    }
    return { id, name, email, phone, timezone };
  });

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    // Batch process with transaction
    await prisma.$transaction(
      contactsToProcess.map((contact) =>
        prisma.contact.upsert({
          where: { email: contact.email},
          create: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
            timezone: contact.timezone,
          },
          update: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
            timezone: contact.timezone,
          },
        })
      )
    );
    return NextResponse.json({ message: 'Batch processing completed successfully.' });
  } catch (error) {
    return NextResponse.json({ message: 'Error in batch processing.', error }, { status: 500 });
  }
};
