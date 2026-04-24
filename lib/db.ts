import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const FALLBACK_DATABASE_URL =
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return FALLBACK_DATABASE_URL;
  }

  try {
    new URL(databaseUrl);
    return databaseUrl;
  } catch {
    return FALLBACK_DATABASE_URL;
  }
}

export function assertDatabaseConfigured() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl === "your_neon_connection_string") {
    throw new Error(
      "DATABASE_URL is not configured. Add your Neon connection string to .env.local.",
    );
  }

  try {
    new URL(databaseUrl);
  } catch {
    throw new Error(
      "DATABASE_URL is invalid. Add a valid Neon connection string to .env.local.",
    );
  }
}

const sql = neon(getDatabaseUrl());

export const db = drizzle({
  client: sql,
  schema,
});
