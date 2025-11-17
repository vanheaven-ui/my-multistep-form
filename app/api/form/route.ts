import { NextResponse } from "next/server";
import { formSchema } from "../../../lib/validation/form-schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate incoming payload
    const parsed = formSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    // TODO Step 2+3:
    // - Save to database (Prisma)
    // - Handle file storage
    // - Return record ID

    return NextResponse.json(
      {
        success: true,
        message: "Form received successfully",
        payload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /form POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
