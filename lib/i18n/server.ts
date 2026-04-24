import type { Locale } from "./messages";
import { defaultLocale, isLocale, translate } from "./messages";

export function getRequestLocale(request: Request): Locale {
  const explicitLocale = request.headers.get("x-locale");

  if (isLocale(explicitLocale)) {
    return explicitLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");

  if (acceptLanguage?.toLowerCase().includes("uk")) {
    return "uk";
  }

  return defaultLocale;
}

export function tRequest(
  request: Request,
  key: string,
  values?: Record<string, string | number>,
) {
  return translate(getRequestLocale(request), key, values);
}
