import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __parcelDb: ReturnType<typeof drizzle<typeof schema>> | undefined;
  var __parcelSql: postgres.Sql | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return databaseUrl;
}

export function getDb() {
  if (globalThis.__parcelDb) {
    return globalThis.__parcelDb;
  }

  const sql = postgres(getDatabaseUrl(), {
    max: 1,
    prepare: false,
  });
  const db = drizzle(sql, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__parcelDb = db;
    globalThis.__parcelSql = sql;
  }

  return db;
}
