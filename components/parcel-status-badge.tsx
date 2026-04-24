import { cn } from "@/lib/utils";
import type { ParcelStatus } from "@/lib/types";

const badgeClasses: Record<ParcelStatus, string> = {
  absent: "bg-slate-100 text-slate-700",
  delivered: "bg-emerald-100 text-emerald-700",
  new: "bg-sky-100 text-sky-700",
  rejected: "bg-rose-100 text-rose-700",
  returned: "bg-amber-100 text-amber-700",
};

const statusLabels: Record<ParcelStatus, string> = {
  absent: "Absent",
  delivered: "Delivered",
  new: "New",
  rejected: "Rejected",
  returned: "Returned",
};

export function ParcelStatusBadge({ status }: { status: ParcelStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        badgeClasses[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
