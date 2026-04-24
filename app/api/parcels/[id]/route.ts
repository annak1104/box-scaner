import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateParcelStatus } from "@/lib/repositories/parcels";
import { parcelIdSchema, updateParcelStatusSchema } from "@/lib/validators";

function getServerErrorMessage(error: unknown, fallback: string) {
  if (
    error instanceof Error &&
    (error.message.includes("DATABASE_URL") ||
      error.message.toLowerCase().includes("connection"))
  ) {
    return error.message;
  }

  return fallback;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const parsedId = parcelIdSchema.parse(id);
    const payload = updateParcelStatusSchema.parse(await request.json());

    const parcel = await updateParcelStatus(parsedId, payload.status);

    if (!parcel) {
      return NextResponse.json(
        { message: "Parcel not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ parcel });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0]?.message ?? "Invalid request.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: getServerErrorMessage(
          error,
          "Unable to update parcel status.",
        ),
      },
      { status: 500 },
    );
  }
}
