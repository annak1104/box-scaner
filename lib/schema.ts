import { pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const parcelStatusEnum = pgEnum("parcel_status", [
  "new",
  "delivered",
  "returned",
  "rejected",
  "absent",
]);

export const parcels = pgTable("parcels", {
  branchNumber: varchar("branch_number", { length: 32 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  id: serial("id").primaryKey(),
  status: parcelStatusEnum("status").default("new").notNull(),
  ttn: varchar("ttn", { length: 128 }).notNull().unique(),
});

export type ParcelRecord = typeof parcels.$inferSelect;
