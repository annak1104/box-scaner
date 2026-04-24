import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createOrFetchParcel,
  listParcels,
} from "@/lib/repositories/parcels";
import { createParcelSchema, parcelQuerySchema } from "@/lib/validators";

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

export async function GET(request: Request) {
  try {
    const filters = parcelQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );

    const payload = await listParcels(filters);
    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0]?.message ?? "Invalid query parameters.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: getServerErrorMessage(error, "Unable to load parcels.") },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = createParcelSchema.parse(await request.json());
    const result = await createOrFetchParcel(payload);

    return NextResponse.json(
      {
        message: result.created
          ? "Parcel created."
          : "Duplicate TTN detected.",
        parcel: result.parcel,
      },
      { status: result.created ? 201 : 409 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0]?.message ?? "Invalid payload.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: getServerErrorMessage(error, "Unable to save parcel.") },
      { status: 500 },
    );
  }
}
