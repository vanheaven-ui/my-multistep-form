import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configure S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

// Type-safe interfaces
interface UploadedFile {
  name: string;
  type: string;
  size: number;
  s3Url?: string;
}

interface FormFields {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  [key: string]: string | undefined;
}

export async function POST(req: Request) {
  try {
    const formData: FormData = await req.formData();

    const fields: FormFields = { fullName: '', email: '' };
    const files: UploadedFile[] = [];

    // Parse FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (!ALLOWED_TYPES.includes(value.type)) {
          return NextResponse.json(
            { ok: false, error: `File type not allowed: ${value.type}` },
            { status: 400 },
          );
        }

        if (value.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { ok: false, error: `File too large: ${value.name}` },
            { status: 400 },
          );
        }

        files.push({
          name: value.name,
          type: value.type,
          size: value.size,
        });
      } else if (typeof value === 'string') {
        switch (key) {
          case 'fullName':
          case 'email':
          case 'phone':
          case 'address':
            fields[key] = value;
            break;
          default:
            console.warn(`Unexpected field: ${key}`);
        }
      }
    }

    // Upload files in parallel to S3
    const uploadedFiles = await Promise.all(
      Array.from(formData.entries())
        .filter(([, value]) => value instanceof File)
        .map(async ([, file]) => {
          const f = file as File;
          const arrayBuffer = await f.arrayBuffer();
          const key = `uploads/${Date.now()}-${f.name}`;

          await s3.send(
            new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key,
              Body: new Uint8Array(arrayBuffer),
              ContentType: f.type,
            }),
          );

          return {
            name: f.name,
            type: f.type,
            size: f.size,
            s3Url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
          };
        }),
    );

    // Persist form data + file metadata to DB
    const submission = await prisma.formSubmission.create({
      data: {
        fullName: fields.fullName,
        email: fields.email,
        phone: fields.phone ?? null,
        address: fields.address ?? null,
        attachments: {
          create: uploadedFiles.map((f) => ({
            name: f.name,
            type: f.type,
            size: f.size,
            url: f.s3Url!,
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
