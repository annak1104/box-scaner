import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";

export default defineConfig([
  nextPlugin.flatConfig.recommended,
  nextPlugin.flatConfig.coreWebVitals,
  globalIgnores([".next/**", "build/**", "next-env.d.ts", "out/**"]),
]);
