"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import type { ParcelStatusFilter, ParcelSortOrder } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ParcelFiltersProps = {
  search: string;
  status: ParcelStatusFilter;
  sort: ParcelSortOrder;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ParcelStatusFilter) => void;
  onSortChange: (value: ParcelSortOrder) => void;
  onReset: () => void;
};

export function ParcelFilters({
  search,
  status,
  sort,
  onReset,
  onSearchChange,
  onSortChange,
  onStatusChange,
}: ParcelFiltersProps) {
  const { t } = useI18n();

  return (
    <section className="panel space-y-4 px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        {t("filters.title")}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            className="h-12 pl-10"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange(value as ParcelStatusFilter)
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("filters.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
              <SelectItem value="new">{t("status.new")}</SelectItem>
              <SelectItem value="delivered">{t("status.delivered")}</SelectItem>
              <SelectItem value="returned">{t("status.returned")}</SelectItem>
              <SelectItem value="rejected">{t("status.rejected")}</SelectItem>
              <SelectItem value="absent">{t("status.absent")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as ParcelSortOrder)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("filters.sortPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("filters.newestFirst")}</SelectItem>
              <SelectItem value="oldest">{t("filters.oldestFirst")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="button" variant="outline" className="h-11 w-full" onClick={onReset}>
          {t("filters.reset")}
        </Button>
      </div>
    </section>
  );
}
