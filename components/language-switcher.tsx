"use client";

import { Languages } from "lucide-react";
import { useI18n } from "./i18n-provider";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-2 py-2 shadow-lg backdrop-blur">
      <div className="rounded-full bg-primary/10 p-2 text-primary">
        <Languages className="h-4 w-4" />
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          size="sm"
          variant={locale === "en" ? "default" : "ghost"}
          className="h-9 rounded-full px-3"
          onClick={() => setLocale("en")}
          aria-label={t("lang.english")}
        >
          EN
        </Button>
        <Button
          type="button"
          size="sm"
          variant={locale === "uk" ? "default" : "ghost"}
          className="h-9 rounded-full px-3"
          onClick={() => setLocale("uk")}
          aria-label={t("lang.ukrainian")}
        >
          UA
        </Button>
      </div>
    </div>
  );
}
