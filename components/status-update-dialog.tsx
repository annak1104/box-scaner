"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { parcelStatusOptions } from "@/lib/parcels";
import type { Parcel, ParcelStatus } from "@/lib/types";
import { ParcelStatusBadge } from "./parcel-status-badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type StatusUpdateDialogProps = {
  open: boolean;
  parcel: Parcel | null;
  mode?: "default" | "duplicate";
  onOpenChange: (open: boolean) => void;
  onUpdated: (parcel: Parcel) => void;
};

export function StatusUpdateDialog({
  open,
  parcel,
  mode = "default",
  onOpenChange,
  onUpdated,
}: StatusUpdateDialogProps) {
  const { locale, t } = useI18n();
  const [status, setStatus] = useState<ParcelStatus>("new");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parcel) {
      setStatus(parcel.status);
      setError(null);
    }
  }, [parcel]);

  const handleSave = async () => {
    if (!parcel) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/parcels/${parcel.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as {
        message?: string;
        parcel?: Parcel;
      };

      if (!response.ok || !payload.parcel) {
        throw new Error(payload.message || t("api.unableUpdateParcel"));
      }

      onUpdated(payload.parcel);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : t("network.unexpected"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "duplicate"
              ? t("statusDialog.titleDuplicate")
              : t("statusDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {mode === "duplicate" && parcel
              ? t("statusDialog.descriptionDuplicate", { ttn: parcel.ttn })
              : parcel
              ? t("statusDialog.descriptionExisting", { ttn: parcel.ttn })
              : t("statusDialog.descriptionGeneric")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {parcel ? (
            <div className="rounded-2xl border border-border/80 bg-muted/40 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {t("statusDialog.ttn")}
                  </p>
                  <p className="text-sm font-semibold">{parcel.ttn}</p>
                </div>
                <ParcelStatusBadge status={parcel.status} />
              </div>
              {mode === "duplicate" ? (
                <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{t("statusDialog.duplicateHint")}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-sm font-medium">{t("statusDialog.status")}</p>
            <Select value={status} onValueChange={(value) => setStatus(value as ParcelStatus)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t("statusDialog.select")} />
              </SelectTrigger>
              <SelectContent>
                {parcelStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`status.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button className="h-12 w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("statusDialog.saving")}
              </>
            ) : (
              t("statusDialog.save")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
