import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'prompts', 'Servicios y Productos.csv');
    
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Products file not found.', path: filePath }, { status: 404 });
    }

    let fileContent = fs.readFileSync(filePath, 'utf-8');
    // Strip BOM if present (common issue with CSVs saved in Windows)
    if (fileContent.charCodeAt(0) === 0xFEFF) {
        fileContent = fileContent.slice(1);
    }
    
    const lines = fileContent.trim().split(/\r?\n/);
    if (lines.length < 2) {
        return NextResponse.json({ error: 'CSV is empty or has only a header.' }, { status: 500 });
    }

    const headerLine = lines.shift();
    if (!headerLine) {
        return NextResponse.json({ error: 'CSV file is empty or has no header' }, { status: 500 });
    }

    const headers = headerLine.split(/,(?=(?:(?:[^ "]*\"){2})*[^ "]*$)/).map(h => h.trim().replace(/"/g, ''));
    const nameToFind = 'Nombre del Producto o Servicio';
    const nameIndex = headers.findIndex(h => h.normalize() === nameToFind.normalize());

    if (nameIndex === -1) {
      return NextResponse.json({ error: 'Column "Nombre del Producto o Servicio" not found in CSV. Found headers: ' + headers.join(', ') }, { status: 500 });
    }

    const products = lines
      .map(line => {
        if (!line) return null;
        const values = line.split(/,(?=(?:(?:[^ "]*\"){2})*[^ "]*$)/);
        return values[nameIndex] ? values[nameIndex].trim().replace(/"/g, '') : null;
      })
      .filter(Boolean) as string[];

    if (products.length === 0) {
        return NextResponse.json({ error: 'Could not parse any product names from CSV.' }, { status: 500 });
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error in /api/products:', error);
    return NextResponse.json({ error: 'Server error while reading products.', message: error.message }, { status: 500 });
  }
}
