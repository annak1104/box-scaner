"use client";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import type { ParcelStatus } from "@/lib/types";

const badgeClasses: Record<ParcelStatus, string> = {
  absent: "bg-slate-100 text-slate-700",
  delivered: "bg-emerald-100 text-emerald-700",
  in_storage: "bg-amber-100 text-amber-800",
  new: "bg-sky-100 text-sky-700",
  received: "bg-violet-100 text-violet-700",
  rejected: "bg-rose-100 text-rose-700",
  returned: "bg-amber-100 text-amber-700",
};

export function ParcelStatusBadge({ status }: { status: ParcelStatus }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        badgeClasses[status],
      )}
    >
      {t(`status.${status}`)}
    </span>
  );
}
