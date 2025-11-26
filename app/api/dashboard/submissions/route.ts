import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET: fetch all submissions
export async function GET() {
  try {
    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true, // fetch related FileAttachment records
      },
    });

    return NextResponse.json({ ok: true, submissions });
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch submissions' },
      { status: 500 },
    );
  }
}
