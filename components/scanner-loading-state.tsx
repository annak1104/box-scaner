"use client";

import { useI18n } from "./i18n-provider";

export function ScannerLoadingState() {
  const { t } = useI18n();

  return (
    <div className="panel flex min-h-80 items-center justify-center p-6 text-sm text-muted-foreground">
      {t("scan.loadingScanner")}
    </div>
  );
}
