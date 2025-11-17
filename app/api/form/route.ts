import { NextResponse } from 'next/server';
import formidable, { File } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ParsedFields {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ParsedFiles {
  attachments?: File[];
}

export async function POST(req: Request) {
  const form = formidable({ multiples: true });

  return new Promise<NextResponse>((resolve, reject) => {
    form.parse(
      req as any,
      (err: Error | null, fields: ParsedFields, files: ParsedFiles) => {
        if (err) {
          console.error(err);
          return reject(
            NextResponse.json(
              { ok: false, error: err.message },
              { status: 500 },
            ),
          );
        }

        // Here you could save to Prisma DB
        // const saved = await prisma.submission.create({ data: {...fields, files: JSON.stringify(files)} });

        console.log('Received fields:', fields);
        console.log('Received files:', files.attachments);

        resolve(
          NextResponse.json({
            ok: true,
            fields,
            files: files.attachments || [],
          }),
        );
      },
    );
  });
}
