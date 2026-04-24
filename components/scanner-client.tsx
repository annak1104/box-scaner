"use client";

import type { Html5Qrcode as Html5QrcodeType } from "html5-qrcode";
import { useEffect, useId, useRef, useState } from "react";
import { Camera, CameraOff, Loader2 } from "lucide-react";

type ScannerClientProps = {
  isLocked?: boolean;
  onDetected: (ttn: string) => void | Promise<void>;
  onScannerError: (message: string) => void;
};

export default function ScannerClient({
  isLocked = false,
  onDetected,
  onScannerError,
}: ScannerClientProps) {
  const regionId = useId().replace(/:/g, "");
  const scannerRef = useRef<Html5QrcodeType | null>(null);
  const scannedRef = useRef(false);
  const onDetectedRef = useRef(onDetected);
  const onScannerErrorRef = useRef(onScannerError);
  const [isReady, setIsReady] = useState(false);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    onScannerErrorRef.current = onScannerError;
  }, [onScannerError]);

  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } finally {
      scanner.clear();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      setIsStarting(true);
      setIsReady(false);
      scannedRef.current = false;

      try {
        const html5QrcodeModule = await import("html5-qrcode");

        if (cancelled) {
          return;
        }

        const { Html5Qrcode, Html5QrcodeSupportedFormats } = html5QrcodeModule;
        const scanner = new Html5Qrcode(regionId, {
          verbose: false,
        });

        scannerRef.current = scanner;

        const config = {
          aspectRatio: 1.6,
          disableFlip: true,
          fps: 10,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
          ],
          qrbox: {
            height: 120,
            width: 260,
          },
        };

        const onScanSuccess = async (decodedText: string) => {
          const normalized = decodedText.trim();

          if (!normalized || scannedRef.current || isLocked) {
            return;
          }

          scannedRef.current = true;
          await stopScanner();
          await onDetectedRef.current(normalized);
        };

        try {
          await scanner.start(
            { facingMode: { exact: "environment" } },
            config,
            onScanSuccess,
            undefined,
          );
        } catch {
          try {
            await scanner.start(
              { facingMode: "environment" },
              config,
              onScanSuccess,
              undefined,
            );
          } catch {
            const cameras = await Html5Qrcode.getCameras();

            if (!cameras.length) {
              throw new Error("No camera available on this device.");
            }

            await scanner.start(cameras[0].id, config, onScanSuccess, undefined);
          }
        }

        if (cancelled) {
          await stopScanner();
          return;
        }

        setIsReady(true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to start scanner.";
        const lowerCased = message.toLowerCase();

        if (lowerCased.includes("permission") || lowerCased.includes("denied")) {
          onScannerErrorRef.current(
            "Camera permission denied. Please allow camera access and try again.",
          );
        } else if (lowerCased.includes("camera")) {
          onScannerErrorRef.current(message);
        } else {
          onScannerErrorRef.current(
            "Unable to start barcode scanner on this device.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsStarting(false);
        }
      }
    }

    void startScanner();

    return () => {
      cancelled = true;
      void stopScanner();
    };
  }, [isLocked, regionId]);

  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            {isReady ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold">Live scanner</p>
            <p className="text-sm text-muted-foreground">
              Align the barcode inside the frame
            </p>
          </div>
        </div>
        {isStarting ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Starting
          </div>
        ) : null}
      </div>

      <div className="relative bg-slate-950 px-3 py-3">
        <div id={regionId} className="min-h-80 overflow-hidden rounded-[1.25rem]" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-[78%] rounded-3xl border-2 border-dashed border-white/70 shadow-[0_0_0_999px_rgba(15,23,42,0.45)]" />
        </div>
      </div>

      <div className="px-4 py-4 text-sm text-muted-foreground">
        Keep the barcode steady for a moment. If nothing is detected, move a bit
        closer or improve lighting.
      </div>
    </section>
  );
}
