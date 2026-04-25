"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ScanLine,
} from "lucide-react";
import { BranchGuard } from "@/components/branch-guard";
import { useI18n } from "@/components/i18n-provider";
import { ScannerLoadingState } from "@/components/scanner-loading-state";
import { StatusUpdateDialog } from "@/components/status-update-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { playScanTone, vibrateDevice } from "@/lib/client-feedback";
import {
  getTtnValidationErrorKey,
  normalizeTtn,
} from "@/lib/parcels";
import { useBranchStore } from "@/lib/stores/branch-store";
import type { Parcel } from "@/lib/types";

const ScannerClient = dynamic(() => import("@/components/scanner-client"), {
  ssr: false,
  loading: () => <ScannerLoadingState />,
});

type CreateParcelResponse = {
  message?: string;
  parcel?: Parcel;
};

export default function ScanPage() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const branchNumber = useBranchStore((state) => state.branchNumber);
  const [scannerKey, setScannerKey] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualTtn, setManualTtn] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"loading" | "success" | "warning">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingParcel, setExistingParcel] = useState<Parcel | null>(null);

  const resetScanner = () => {
    setScannerKey((current) => current + 1);
    setErrorMessage(null);
    setStatusMessage(null);
    setStatusTone("loading");
  };

  const processTtn = async (rawTtn: string) => {
    const ttn = normalizeTtn(rawTtn);

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(t("scan.barcodeDetected", { ttn }));
    setStatusTone("loading");

    try {
      const response = await fetch("/api/parcels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify({ ttn, branchNumber }),
      });

      const payload = (await response.json()) as CreateParcelResponse;

      if (response.status === 201 && payload.parcel) {
        vibrateDevice([120, 40, 120]);
        playScanTone();
        setStatusTone("success");
        setStatusMessage(
          t("scan.parcelSaved", { ttn: payload.parcel.ttn }),
        );
        setManualTtn("");
        window.setTimeout(() => {
          router.replace("/parcels");
        }, 900);
        return;
      }

      if (response.status === 409 && payload.parcel) {
        vibrateDevice([80, 30, 80]);
        setExistingParcel(payload.parcel);
        setStatusTone("warning");
        setStatusMessage(
          t("scan.parcelExists", { ttn: payload.parcel.ttn }),
        );
        return;
      }

      throw new Error(payload.message ?? t("api.unableSaveParcel"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("network.unexpected"),
      );
      setScannerKey((current) => current + 1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDetected = async (ttn: string) => {
    await processTtn(ttn);
  };

  const handleManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrorKey = getTtnValidationErrorKey(manualTtn);

    if (validationErrorKey) {
      setErrorMessage(t(validationErrorKey));
      return;
    }

    await processTtn(manualTtn);
  };

  return (
    <BranchGuard>
      <main className="app-shell gap-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("scan.back")}
            </Link>
          </Button>
          <p className="text-sm font-medium text-muted-foreground">
            {t("branch.number", { branchNumber })}
          </p>
        </div>

        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/75">
              {t("scan.flow")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {t("scan.title")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("scan.description")}
            </p>
          </div>
        </section>

        <ScannerClient
          key={scannerKey}
          isLocked={isProcessing || Boolean(existingParcel)}
          onDetected={handleDetected}
          onScannerError={(message) => setErrorMessage(message)}
        />

        <section className="panel space-y-4 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">{t("manualEntry.title")}</p>
            <p className="text-sm text-muted-foreground">
              {t("manualEntry.description")}
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleManualSubmit}>
            <Input
              value={manualTtn}
              onChange={(event) => {
                setManualTtn(event.target.value);
                if (errorMessage) {
                  setErrorMessage(null);
                }
              }}
              placeholder={t("manualEntry.placeholder")}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className="h-12"
            />
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("manualEntry.processing")}
                </>
              ) : (
                t("manualEntry.submit")
              )}
            </Button>
          </form>
        </section>

        {statusMessage ? (
          <div
            className={`panel flex items-start gap-3 px-4 py-4 ${
              statusTone === "warning"
                ? "border-amber-200 bg-amber-50"
                : ""
            }`}
          >
            {statusTone === "loading" ? (
              <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-primary" />
            ) : statusTone === "warning" ? (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
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
                {t("scan.retry")}
              </Button>
            </div>
          </div>
        ) : null}

        <StatusUpdateDialog
          open={Boolean(existingParcel)}
          parcel={existingParcel}
          mode="duplicate"
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
