"use client";

import { Search, SlidersHorizontal } from "lucide-react";
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
  return (
    <section className="panel space-y-4 px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by TTN"
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
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as ParcelSortOrder)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="button" variant="outline" className="h-11 w-full" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </section>
  );
}
