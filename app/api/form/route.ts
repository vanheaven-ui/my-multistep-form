import { NextResponse } from 'next/server';

// Type-safe interface for uploaded files
interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
}

export async function POST(req: Request) {
  try {
    // Parse the incoming form data (Web API FormData)
    const formData: FormData = await req.formData();

    // Prepare containers for fields and files
    const fields: Record<string, string> = {};
    const files: UploadedFile[] = [];

    // Iterate through all form entries
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const data = await value.arrayBuffer();
        files.push({
          name: value.name,
          type: value.type,
          size: value.size,
          data,
        });
      } else if (typeof value === 'string') {
        fields[key] = value;
      }
    }

    console.log('Received fields:', fields);
    console.log(
      'Received files:',
      files.map((f) => f.name),
    );

    // Respond with fields and file metadata
    return NextResponse.json({
      ok: true,
      fields,
      files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 },
    );
  }
}
