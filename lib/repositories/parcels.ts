import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { assertDatabaseConfigured, db } from "@/lib/db";
import { parcels } from "@/lib/schema";
import type {
  CreateParcelInput,
  ParcelQueryInput,
  ParcelStatus,
} from "@/lib/types";

export async function findParcelByTtn(ttn: string) {
  assertDatabaseConfigured();
  const [parcel] = await db
    .select()
    .from(parcels)
    .where(eq(parcels.ttn, ttn))
    .limit(1);

  return parcel ?? null;
}

export async function createParcel(input: CreateParcelInput) {
  assertDatabaseConfigured();
  const [parcel] = await db
    .insert(parcels)
    .values({
      branchNumber: input.branchNumber,
      status: "new",
      ttn: input.ttn,
    })
    .returning();

  return parcel;
}

export async function createOrFetchParcel(input: CreateParcelInput) {
  assertDatabaseConfigured();
  const inserted = await db
    .insert(parcels)
    .values({
      branchNumber: input.branchNumber,
      status: "new",
      ttn: input.ttn,
    })
    .onConflictDoNothing({
      target: parcels.ttn,
    })
    .returning();

  if (inserted[0]) {
    return {
      created: true,
      parcel: inserted[0],
    };
  }

  const existingParcel = await findParcelByTtn(input.ttn);

  if (!existingParcel) {
    throw new Error("api.unableSaveParcel");
  }

  return {
    created: false,
    parcel: existingParcel,
  };
}

export async function listParcels(input: ParcelQueryInput) {
  assertDatabaseConfigured();
  const predicates = [eq(parcels.branchNumber, input.branch)];

  if (input.status && input.status !== "all") {
    predicates.push(eq(parcels.status, input.status));
  }

  if (input.search) {
    predicates.push(ilike(parcels.ttn, `%${input.search}%`));
  }

  const whereClause = and(...predicates);
  const offset = (input.page - 1) * input.pageSize;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(parcels)
    .where(whereClause);

  const items = await db
    .select()
    .from(parcels)
    .where(whereClause)
    .orderBy(
      input.sort === "oldest" ? asc(parcels.createdAt) : desc(parcels.createdAt),
    )
    .limit(input.pageSize)
    .offset(offset);

  return {
    items,
    page: input.page,
    pageSize: input.pageSize,
    total: countResult?.count ?? 0,
  };
}

export async function updateParcelStatus(id: number, status: ParcelStatus) {
  assertDatabaseConfigured();
  const [parcel] = await db
    .update(parcels)
    .set({ status })
    .where(eq(parcels.id, id))
    .returning();

  return parcel ?? null;
}
