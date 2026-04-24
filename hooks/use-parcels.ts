"use client";

import { useCallback, useDeferredValue, useEffect, useState } from "react";
import type { Parcel, ParcelStatusFilter, ParcelSortOrder } from "@/lib/types";

type UseParcelsParams = {
  branchNumber: string;
  page: number;
  pageSize: number;
  search: string;
  sort: ParcelSortOrder;
  status: ParcelStatusFilter;
};

type ParcelResponse = {
  items: Parcel[];
  page: number;
  pageSize: number;
  total: number;
};

const initialData: ParcelResponse = {
  items: [],
  page: 1,
  pageSize: 12,
  total: 0,
};

export function useParcels({
  branchNumber,
  page,
  pageSize,
  search,
  sort,
  status,
}: UseParcelsParams) {
  const deferredSearch = useDeferredValue(search);
  const [data, setData] = useState<ParcelResponse>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchParcels = useCallback(async () => {
    if (!branchNumber) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        branch: branchNumber,
        page: String(page),
        pageSize: String(pageSize),
        sort,
      });

      if (deferredSearch.trim()) {
        query.set("search", deferredSearch.trim());
      }

      if (status !== "all") {
        query.set("status", status);
      }

      const response = await fetch(`/api/parcels?${query.toString()}`, {
        cache: "no-store",
      });

      const payload = (await response.json()) as ParcelResponse & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message || "Unable to load parcels.");
      }

      setData(payload);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unexpected network error.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [branchNumber, deferredSearch, page, pageSize, sort, status]);

  useEffect(() => {
    void fetchParcels();
  }, [fetchParcels]);

  return {
    data,
    error,
    isLoading,
    refresh: () => {
      void fetchParcels();
    },
    replaceParcel: (updatedParcel: Parcel) => {
      setData((current) => ({
        ...current,
        items: current.items.map((parcel) =>
          parcel.id === updatedParcel.id ? updatedParcel : parcel,
        ),
      }));
    },
  };
}
