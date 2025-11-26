import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// DELETE: delete a submission by ID
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // get last segment

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Submission ID is required' },
        { status: 400 },
      );
    }

    //  Delete related FileAttachment records
    await prisma.fileAttachment.deleteMany({
      where: { formId: id },
    });

    // Delete the FormSubmission
    await prisma.formSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete submission:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete submission' },
      { status: 500 },
    );
  }
}
