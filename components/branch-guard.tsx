"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBranchStore } from "@/lib/stores/branch-store";

export function BranchGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const branchNumber = useBranchStore((state) => state.branchNumber);
  const hasHydrated = useBranchStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !branchNumber) {
      router.replace("/");
    }
  }, [branchNumber, hasHydrated, router]);

  if (!hasHydrated || !branchNumber) {
    return (
      <main className="app-shell justify-center">
        <div className="panel px-5 py-10 text-center text-sm text-muted-foreground">
          Loading branch workspace...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
