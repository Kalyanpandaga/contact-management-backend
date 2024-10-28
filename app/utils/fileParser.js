// api/helpers/fileParser.js

import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
import { stringify } from 'csv-stringify/sync';

// Parse CSV data
export async function parseCSV(fileBuffer) {
  const rows = [];
  const stream = Readable.from(fileBuffer);
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (error) => reject(error));
  });
}

// Parse Excel data
export function parseExcel(fileBuffer) {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

export function generateCSVBuffer(data) {
  // Convert JSON to CSV format
  const csvData = stringify(data, {
    header: true,
    columns: ['name', 'email', 'phone', 'address', 'timezone', 'createdAt', 'updatedAt'],
  });
  return Buffer.from(csvData);
}
