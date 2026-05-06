import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { tRequest } from "@/lib/i18n/server";
import { deleteParcel, updateParcelStatus } from "@/lib/repositories/parcels";
import { parcelIdSchema, updateParcelStatusSchema } from "@/lib/validators";

function getServerErrorMessage(
  request: Request,
  error: unknown,
  fallbackKey: string,
) {
  if (error instanceof Error) {
    if (error.message.startsWith("api.")) {
      return tRequest(request, error.message);
    }

    if (error.message.toLowerCase().includes("connection")) {
      return tRequest(request, "api.database.invalid");
    }
  }

  return tRequest(request, fallbackKey);
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
        { message: tRequest(request, "api.parcelNotFound") },
        { status: 404 },
      );
    }

    return NextResponse.json({ parcel });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: tRequest(
            request,
            error.issues[0]?.message ?? "api.invalidRequest",
          ),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: getServerErrorMessage(
          request,
          error,
          "api.unableUpdateParcel",
        ),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const parsedId = parcelIdSchema.parse(id);

    const parcel = await deleteParcel(parsedId);

    if (!parcel) {
      return NextResponse.json(
        { message: tRequest(request, "api.parcelNotFound") },
        { status: 404 },
      );
    }

    return NextResponse.json({ parcel });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: tRequest(
            request,
            error.issues[0]?.message ?? "api.invalidRequest",
          ),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: getServerErrorMessage(
          request,
          error,
          "api.unableDeleteParcel",
        ),
      },
      { status: 500 },
    );
  }
}
