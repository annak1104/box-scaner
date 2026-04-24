import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

function loadDatabaseUrl() {
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

  return process.env.DATABASE_URL ?? "";
}

export default defineConfig({
  dbCredentials: {
    url: loadDatabaseUrl(),
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./lib/schema.ts",
});
