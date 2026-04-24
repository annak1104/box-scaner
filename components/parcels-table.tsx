"use client";

import { AlertCircle } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import type { Parcel } from "@/lib/types";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ParcelStatusBadge } from "./parcel-status-badge";

type ParcelsTableProps = {
  parcels: Parcel[];
  isLoading: boolean;
  error: string | null;
  onUpdateStatus: (parcel: Parcel) => void;
};

export function ParcelsTable({
  error,
  isLoading,
  parcels,
  onUpdateStatus,
}: ParcelsTableProps) {
  const { locale, t } = useI18n();

  return (
    <section className="panel overflow-hidden">
      {error ? (
        <div className="flex items-start gap-3 border-b border-destructive/20 bg-destructive/5 px-4 py-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.ttn")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.date")}</TableHead>
            <TableHead className="text-right">{t("table.action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                {t("table.loading")}
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading && parcels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                {t("table.empty")}
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading
            ? parcels.map((parcel) => (
                <TableRow key={parcel.id}>
                  <TableCell className="font-medium">{parcel.ttn}</TableCell>
                  <TableCell>
                    <ParcelStatusBadge status={parcel.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US", {
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(parcel.createdAt))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(parcel)}
                    >
                      {t("table.updateStatus")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </section>
  );
}
