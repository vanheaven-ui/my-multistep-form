import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Type-safe interface for uploaded files
interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data?: ArrayBuffer; // Optional if not storing binary in DB
}

// Type-safe interface for form fields
interface FormFields {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  [key: string]: string | undefined; // Allows dynamic assignment
}

export async function POST(req: Request) {
  try {
    // Parse incoming FormData
    const formData: FormData = await req.formData();

    // Initialize form fields and files
    const fields: FormFields = {
      fullName: '',
      email: '',
    };
    const files: UploadedFile[] = [];

    // Iterate through all form entries
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        files.push({
          name: value.name,
          type: value.type,
          size: value.size,
          data: arrayBuffer,
        });
      } else if (typeof value === 'string') {
        // Safely assign only known keys
        switch (key) {
          case 'fullName':
            fields.fullName = value;
            break;
          case 'email':
            fields.email = value;
            break;
          case 'phone':
            fields.phone = value;
            break;
          case 'address':
            fields.address = value;
            break;
          default:
            console.warn(`Unexpected field: ${key}`);
        }
      }
    }

    console.log('Received fields:', fields);
    console.log(
      'Received files:',
      files.map((f) => f.name),
    );

    // Persist data in DB with Prisma
    const submission = await prisma.formSubmission.create({
      data: {
        fullName: fields.fullName,
        email: fields.email,
        phone: fields.phone ?? null,
        address: fields.address ?? null,
        attachments: {
          create: files.map((f) => ({
            name: f.name,
            type: f.type,
            size: f.size,
          })),
        },
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    console.error('Form submission error:', error);
    const message =
      error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
