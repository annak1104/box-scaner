import {
  index,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const parcelStatusEnum = pgEnum("parcel_status", [
  "new",
  "received",
  "in_storage",
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
}, (table) => [
  index("parcels_ttn_idx").on(table.ttn),
  index("parcels_branch_number_idx").on(table.branchNumber),
]);

export type ParcelRecord = typeof parcels.$inferSelect;
