import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ ok: true, submissions });
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
