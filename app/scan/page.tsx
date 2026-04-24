"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ScanLine } from "lucide-react";
import { BranchGuard } from "@/components/branch-guard";
import { StatusUpdateDialog } from "@/components/status-update-dialog";
import { Button } from "@/components/ui/button";
import { playScanTone, vibrateDevice } from "@/lib/client-feedback";
import { useBranchStore } from "@/lib/stores/branch-store";
import type { Parcel } from "@/lib/types";

const ScannerClient = dynamic(() => import("@/components/scanner-client"), {
  ssr: false,
  loading: () => (
    <div className="panel flex min-h-80 items-center justify-center p-6 text-sm text-muted-foreground">
      Loading camera scanner...
    </div>
  ),
});

type CreateParcelResponse = {
  message?: string;
  parcel?: Parcel;
};

export default function ScanPage() {
  const router = useRouter();
  const branchNumber = useBranchStore((state) => state.branchNumber);
  const [scannerKey, setScannerKey] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingParcel, setExistingParcel] = useState<Parcel | null>(null);

  const resetScanner = () => {
    setScannerKey((current) => current + 1);
    setErrorMessage(null);
    setStatusMessage(null);
  };

  const handleDetected = async (ttn: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(`Barcode detected: ${ttn}`);

    try {
      const response = await fetch("/api/parcels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ttn, branchNumber }),
      });

      const payload = (await response.json()) as CreateParcelResponse;

      if (response.status === 201 && payload.parcel) {
        vibrateDevice([120, 40, 120]);
        playScanTone();
        setStatusMessage(`Parcel ${payload.parcel.ttn} saved successfully.`);
        window.setTimeout(() => {
          router.replace("/parcels");
        }, 900);
        return;
      }

      if (response.status === 409 && payload.parcel) {
        vibrateDevice([80, 30, 80]);
        setExistingParcel(payload.parcel);
        setStatusMessage(
          `Parcel ${payload.parcel.ttn} already exists. Choose a new status.`,
        );
        return;
      }

      throw new Error(payload.message ?? "Unable to process scanned parcel.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected network error.",
      );
      setScannerKey((current) => current + 1);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <BranchGuard>
      <main className="app-shell gap-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <p className="text-sm font-medium text-muted-foreground">
            Branch #{branchNumber}
          </p>
        </div>

        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/75">
              Scan flow
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Scan parcel barcode
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the back camera, keep the barcode inside the guide, and let
              the scanner create or update the parcel automatically.
            </p>
          </div>
        </section>

        <ScannerClient
          key={scannerKey}
          isLocked={isProcessing || Boolean(existingParcel)}
          onDetected={handleDetected}
          onScannerError={(message) => setErrorMessage(message)}
        />

        {statusMessage ? (
          <div className="panel flex items-start gap-3 px-4 py-4">
            {isProcessing ? (
              <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-primary" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            )}
            <p className="text-sm leading-6">{statusMessage}</p>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="panel flex items-start gap-3 border-destructive/20 bg-destructive/5 px-4 py-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="space-y-3">
              <p className="text-sm leading-6 text-destructive">{errorMessage}</p>
              <Button variant="outline" onClick={resetScanner}>
                <ScanLine className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          </div>
        ) : null}

        <StatusUpdateDialog
          open={Boolean(existingParcel)}
          parcel={existingParcel}
          onOpenChange={(open) => {
            if (!open) {
              setExistingParcel(null);
              setScannerKey((current) => current + 1);
            }
          }}
          onUpdated={() => {
            setExistingParcel(null);
            router.replace("/parcels");
          }}
        />
      </main>
    </BranchGuard>
  );
}
