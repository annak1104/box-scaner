import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const FALLBACK_DATABASE_URL =
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";

function readDatabaseUrlFromEnvFiles() {
  const candidates = [".env.local", ".env"];

  for (const fileName of candidates) {
    const filePath = path.resolve(process.cwd(), fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const match = fileContents.match(/^DATABASE_URL=(.*)$/m);

    if (match?.[1]) {
      return match[1].trim().replace(/^['"]|['"]$/g, "");
    }
  }

  return undefined;
}

function resolveDatabaseUrl() {
  return process.env.DATABASE_URL || readDatabaseUrlFromEnvFiles();
}

function getDatabaseUrl() {
  const databaseUrl = resolveDatabaseUrl();

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
  const databaseUrl = resolveDatabaseUrl();

  if (
    !databaseUrl ||
    databaseUrl === "your_neon_connection_string" ||
    databaseUrl.includes("ep-example")
  ) {
    throw new Error("api.database.missing");
  }

  try {
    new URL(databaseUrl);
  } catch {
    throw new Error("api.database.invalid");
  }
}

const sql = neon(getDatabaseUrl());

export const db = drizzle({
  client: sql,
  schema,
});
