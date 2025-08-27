import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'prompts', 'Servicios y Productos.csv');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Products file not found.' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Use Papaparse to robustly parse the CSV
    const result = Papa.parse(fileContent, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      console.error('Papaparse errors:', result.errors);
      return NextResponse.json({ error: 'Error parsing CSV file.', details: result.errors }, { status: 500 });
    }

    // The 'data' property contains an array of objects
    const products = result.data;

    return NextResponse.json({ products });

  } catch (error: any) {
    console.error('Error in /api/products:', error);
    return NextResponse.json({ error: 'Server error while reading products.', message: error.message }, { status: 500 });
  }
}
