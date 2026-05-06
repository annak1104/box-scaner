"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, PackageOpen, RefreshCcw } from "lucide-react";
import { BranchGuard } from "@/components/branch-guard";
import { useI18n } from "@/components/i18n-provider";
import { ParcelFilters } from "@/components/parcel-filters";
import { ParcelsTable } from "@/components/parcels-table";
import { StatusUpdateDialog } from "@/components/status-update-dialog";
import { Button } from "@/components/ui/button";
import { useParcels } from "@/hooks/use-parcels";
import { isParcelOverdue } from "@/lib/parcels";
import { useBranchStore } from "@/lib/stores/branch-store";
import type { Parcel, ParcelStatusFilter, ParcelSortOrder } from "@/lib/types";

const PAGE_SIZE = 12;

export default function ParcelsPage() {
  const { locale, t } = useI18n();
  const branchNumber = useBranchStore((state) => state.branchNumber);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ParcelStatusFilter>("all");
  const [sort, setSort] = useState<ParcelSortOrder>("newest");
  const [page, setPage] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [deletingParcelId, setDeletingParcelId] = useState<number | null>(null);

  const query = useMemo(
    () => ({
      branchNumber,
      page,
      pageSize: PAGE_SIZE,
      search,
      sort,
      status,
    }),
    [branchNumber, page, search, sort, status],
  );

  const { data, error, isLoading, refresh, removeParcel, replaceParcel } =
    useParcels({
      ...query,
      locale,
    });
  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const overdueParcels = data.items.filter((parcel) => isParcelOverdue(parcel));

  async function handleDeleteParcel(parcel: Parcel) {
    const confirmed = window.confirm(
      t("deleteDialog.confirm", { ttn: parcel.ttn }),
    );

    if (!confirmed) {
      return;
    }

    setDeletingParcelId(parcel.id);

    try {
      const response = await fetch(`/api/parcels/${parcel.id}`, {
        method: "DELETE",
        headers: {
          "x-locale": locale,
        },
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || t("api.unableDeleteParcel"));
      }

      removeParcel(parcel.id);

      if (data.items.length === 1 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
      } else {
        refresh();
      }
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : t("network.unexpected"),
      );
    } finally {
      setDeletingParcelId(null);
    }
  }

  return (
    <BranchGuard>
      <main className="app-shell gap-4">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("scan.back")}
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t("parcels.refresh")}
          </Button>
        </div>

        <section className="panel px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-secondary p-3 text-secondary-foreground">
              <PackageOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/75">
                {t("branch.number", { branchNumber })}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {t("parcels.title")}
              </h1>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {t("parcels.description")}
          </p>
        </section>

        <ParcelFilters
          search={search}
          status={status}
          sort={sort}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onSortChange={setSort}
          onReset={() => {
            setSearch("");
            setStatus("all");
            setSort("newest");
            setPage(1);
          }}
        />

        {overdueParcels.length > 0 ? (
          <section className="panel flex items-start gap-3 border-amber-200 bg-amber-50 px-4 py-4 text-amber-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div className="space-y-1 text-sm leading-6">
              <p className="font-semibold">
                {t("aging.bannerTitle", { count: overdueParcels.length })}
              </p>
              <p>{t("aging.bannerBody")}</p>
            </div>
          </section>
        ) : null}

        <ParcelsTable
          deletingParcelId={deletingParcelId}
          error={error}
          isLoading={isLoading}
          onDelete={handleDeleteParcel}
          parcels={data.items}
          onUpdateStatus={setSelectedParcel}
        />

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-white/70 px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            {t("pagination.pageOf", { page: data.page, totalPages })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              {t("pagination.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              {t("pagination.next")}
            </Button>
          </div>
        </div>

        <StatusUpdateDialog
          open={Boolean(selectedParcel)}
          parcel={selectedParcel}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedParcel(null);
            }
          }}
          onUpdated={(updatedParcel) => {
            replaceParcel(updatedParcel);
            setSelectedParcel(null);
          }}
        />
      </main>
    </BranchGuard>
  );
}
