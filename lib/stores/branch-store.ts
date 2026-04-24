"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BranchStore = {
  branchNumber: string;
  clearBranchNumber: () => void;
  hasHydrated: boolean;
  setBranchNumber: (branchNumber: string) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useBranchStore = create<BranchStore>()(
  persist(
    (set) => ({
      branchNumber: "",
      clearBranchNumber: () => set({ branchNumber: "" }),
      hasHydrated: false,
      setBranchNumber: (branchNumber) => set({ branchNumber }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "parcel-branch-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: ({ branchNumber }) => ({ branchNumber }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
