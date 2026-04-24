import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { tRequest } from "@/lib/i18n/server";
import {
  createOrFetchParcel,
  listParcels,
} from "@/lib/repositories/parcels";
import { createParcelSchema, parcelQuerySchema } from "@/lib/validators";

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
          message: tRequest(
            request,
            error.issues[0]?.message ?? "api.invalidQuery",
          ),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: getServerErrorMessage(request, error, "api.unableLoadParcels") },
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
          ? tRequest(request, "api.parcelCreated")
          : tRequest(request, "api.duplicateTTN"),
        parcel: result.parcel,
      },
      { status: result.created ? 201 : 409 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: tRequest(
            request,
            error.issues[0]?.message ?? "api.invalidPayload",
          ),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: getServerErrorMessage(request, error, "api.unableSaveParcel") },
      { status: 500 },
    );
  }
}
