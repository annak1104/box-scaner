"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import type { Parcel, ParcelStatus } from "@/lib/types";
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
  onOpenChange: (open: boolean) => void;
  onUpdated: (parcel: Parcel) => void;
};

export function StatusUpdateDialog({
  open,
  parcel,
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
          <DialogTitle>{t("statusDialog.title")}</DialogTitle>
          <DialogDescription>
            {parcel
              ? t("statusDialog.descriptionExisting", { ttn: parcel.ttn })
              : t("statusDialog.descriptionGeneric")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("statusDialog.status")}</p>
            <Select value={status} onValueChange={(value) => setStatus(value as ParcelStatus)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t("statusDialog.select")} />
              </SelectTrigger>
              <SelectContent>
                {(["delivered", "returned", "rejected", "absent", "new"] as ParcelStatus[]).map((option) => (
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
