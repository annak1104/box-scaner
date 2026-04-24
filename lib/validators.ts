import { z } from "zod";
import { parcelStatusEnum } from "./schema";

const parcelStatusValues = parcelStatusEnum.enumValues;

export const branchSelectionSchema = z.object({
  branchNumber: z
    .string()
    .trim()
    .min(1, "Branch number is required.")
    .regex(/^\d+$/, "Branch number must contain digits only.")
    .max(32, "Branch number is too long."),
});

export const createParcelSchema = z.object({
  branchNumber: branchSelectionSchema.shape.branchNumber,
  ttn: z
    .string()
    .trim()
    .min(4, "TTN is too short.")
    .max(128, "TTN is too long.")
    .transform((value) => value.toUpperCase()),
});

export const updateParcelStatusSchema = z.object({
  status: z.enum(parcelStatusValues),
});

export const parcelQuerySchema = z.object({
  branch: branchSelectionSchema.shape.branchNumber,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
  search: z.string().trim().max(128).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  status: z.enum(["all", ...parcelStatusValues]).default("all"),
});

export const parcelIdSchema = z.coerce
  .number()
  .int("Parcel id must be a whole number.")
  .positive("Parcel id must be positive.");
