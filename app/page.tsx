"use client";

import { Building2, ChevronRight, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BranchForm } from "@/components/branch-form";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { useBranchStore } from "@/lib/stores/branch-store";

export default function HomePage() {
  const router = useRouter();
  const { t } = useI18n();
  const branchNumber = useBranchStore((state) => state.branchNumber);
  const hasHydrated = useBranchStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && branchNumber) {
      router.replace("/dashboard");
    }
  }, [branchNumber, hasHydrated, router]);

  return (
    <main className="app-shell justify-center gap-6">
      <section className="panel panel-grid overflow-hidden">
        <div className="space-y-6 px-5 py-7 sm:px-6 sm:py-8">
          <div className="inline-flex rounded-full bg-primary/10 p-3 text-primary">
            <PackageSearch className="h-7 w-7" />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary/75">
              {t("app.name")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("home.title")}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("home.description")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-white/80 p-4">
            <BranchForm />
          </div>
        </div>
      </section>

      <section className="panel px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-secondary p-2 text-secondary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t("home.returningWorker")}</p>
            <p className="text-sm text-muted-foreground">
              {t("home.returningWorkerDescription")}
            </p>
          </div>
        </div>

        <Button
          className="mt-4 h-12 w-full justify-between"
          variant="secondary"
          onClick={() => router.push("/dashboard")}
          disabled={!hasHydrated || !branchNumber}
        >
          {t("home.openDashboard")}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </section>
    </main>
  );
}
