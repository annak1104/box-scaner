"use client";

import { ArrowRight, Camera, MapPin, Package2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { BranchGuard } from "@/components/branch-guard";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { useBranchStore } from "@/lib/stores/branch-store";

export default function DashboardPage() {
  const { t } = useI18n();
  const branchNumber = useBranchStore((state) => state.branchNumber);
  const clearBranchNumber = useBranchStore((state) => state.clearBranchNumber);

  return (
    <BranchGuard>
      <main className="app-shell gap-5">
        <section className="panel panel-grid overflow-hidden px-5 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/75">
                {t("dashboard.activeBranch")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {t("dashboard.title")}
              </h1>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-base font-semibold shadow-sm">
                <MapPin className="h-4 w-4 text-primary" />
                {t("branch.number", { branchNumber })}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={clearBranchNumber}
              asChild
            >
              <Link href="/">
                <RotateCcw className="h-5 w-5" />
                <span className="sr-only">{t("branch.change")}</span>
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4">
          <Link href="/scan" className="panel block overflow-hidden">
            <div className="flex min-h-40 items-end justify-between gap-4 bg-[linear-gradient(135deg,rgba(37,99,235,0.95),rgba(14,165,233,0.85))] px-5 py-6 text-white">
              <div className="space-y-3">
                <div className="inline-flex rounded-full bg-white/15 p-3">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/75">
                    {t("dashboard.quickAction")}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    {t("dashboard.scanParcel")}
                  </h2>
                  <p className="mt-2 max-w-xs text-sm text-white/80">
                    {t("dashboard.scanDescription")}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 shrink-0" />
            </div>
          </Link>

          <Link href="/parcels" className="panel block overflow-hidden">
            <div className="flex min-h-36 items-end justify-between gap-4 bg-[linear-gradient(135deg,rgba(245,158,11,0.85),rgba(251,191,36,0.8))] px-5 py-6 text-slate-900">
              <div className="space-y-3">
                <div className="inline-flex rounded-full bg-white/35 p-3">
                  <Package2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-700">
                    {t("dashboard.records")}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    {t("dashboard.viewParcels")}
                  </h2>
                  <p className="mt-2 max-w-xs text-sm text-slate-700">
                    {t("dashboard.viewDescription")}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 shrink-0" />
            </div>
          </Link>
        </section>
      </main>
    </BranchGuard>
  );
}
