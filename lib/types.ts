import type { z } from "zod";
import type {
  branchSelectionSchema,
  createParcelSchema,
  parcelQuerySchema,
  updateParcelStatusSchema,
} from "./validators";
import type { ParcelRecord } from "./schema";

export type Parcel = ParcelRecord;
export type ParcelStatus = Parcel["status"];
export type ParcelStatusFilter = ParcelStatus | "all";
export type ParcelSortOrder = "newest" | "oldest";
export type BranchSelectionInput = z.infer<typeof branchSelectionSchema>;
export type CreateParcelInput = z.infer<typeof createParcelSchema>;
export type UpdateParcelStatusInput = z.infer<typeof updateParcelStatusSchema>;
export type ParcelQueryInput = z.infer<typeof parcelQuerySchema>;
