"use client";

import { Building2, ChevronRight, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BranchForm } from "@/components/branch-form";
import { Button } from "@/components/ui/button";
import { useBranchStore } from "@/lib/stores/branch-store";

export default function HomePage() {
  const router = useRouter();
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
              Parcel Flow
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Scan and manage branch parcels faster.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Enter the branch number to unlock scanning, parcel history, and
              status updates designed for field teams on mobile devices.
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
            <p className="text-sm font-semibold">Returning worker?</p>
            <p className="text-sm text-muted-foreground">
              Your branch stays saved on this device.
            </p>
          </div>
        </div>

        <Button
          className="mt-4 h-12 w-full justify-between"
          variant="secondary"
          onClick={() => router.push("/dashboard")}
          disabled={!hasHydrated || !branchNumber}
        >
          Open dashboard
          <ChevronRight className="h-5 w-5" />
        </Button>
      </section>
    </main>
  );
}
