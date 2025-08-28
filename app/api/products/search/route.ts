import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'lib', 'data', 'Servicios y Productos.csv');
    const csvFile = fs.readFileSync(filePath, 'utf8');

    let productData = '';

Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const foundProduct = results.data.find((row: any) => {
          const productName = row['Nombre del Producto o Servicio'];
          return productName && productName.toLowerCase().includes(query.toLowerCase());
        });

        if (foundProduct) {
          productData = Object.entries(foundProduct)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        }
      },
    });

    if (productData) {
      return NextResponse.json({ success: true, productData });
    } else {
      return NextResponse.json({ success: true, productData: 'Producto no encontrado.' });
    }
  } catch (error) {
    console.error('Error in product search API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
