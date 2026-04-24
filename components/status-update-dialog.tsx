"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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

const options: { label: string; value: ParcelStatus }[] = [
  { label: "Delivered", value: "delivered" },
  { label: "Returned", value: "returned" },
  { label: "Rejected", value: "rejected" },
  { label: "Absent", value: "absent" },
  { label: "New", value: "new" },
];

export function StatusUpdateDialog({
  open,
  parcel,
  onOpenChange,
  onUpdated,
}: StatusUpdateDialogProps) {
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
        },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as {
        message?: string;
        parcel?: Parcel;
      };

      if (!response.ok || !payload.parcel) {
        throw new Error(payload.message || "Unable to update parcel.");
      }

      onUpdated(payload.parcel);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unexpected network error.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update parcel status</DialogTitle>
          <DialogDescription>
            {parcel
              ? `Parcel ${parcel.ttn} was already scanned. Choose the latest delivery result.`
              : "Choose the latest status for this parcel."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Status</p>
            <Select value={status} onValueChange={(value) => setStatus(value as ParcelStatus)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
                Saving...
              </>
            ) : (
              "Save status"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
