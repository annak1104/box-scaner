import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createParcel,
  findParcelByTtn,
  listParcels,
} from "@/lib/repositories/parcels";
import { createParcelSchema, parcelQuerySchema } from "@/lib/validators";

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
      { message: "Unable to load parcels." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = createParcelSchema.parse(await request.json());
    const existingParcel = await findParcelByTtn(payload.ttn);

    if (existingParcel) {
      return NextResponse.json(
        {
          message: "Duplicate TTN detected.",
          parcel: existingParcel,
        },
        { status: 409 },
      );
    }

    const parcel = await createParcel(payload);

    return NextResponse.json(
      {
        parcel,
      },
      { status: 201 },
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
      { message: "Unable to save parcel." },
      { status: 500 },
    );
  }
}
