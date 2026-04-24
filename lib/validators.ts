import { z } from "zod";
import { parcelStatusEnum } from "./schema";

const parcelStatusValues = parcelStatusEnum.enumValues;

export const branchSelectionSchema = z.object({
  branchNumber: z
    .string()
    .trim()
    .min(1, "validation.branch.required")
    .regex(/^\d+$/, "validation.branch.digits")
    .max(32, "validation.branch.max"),
});

export const createParcelSchema = z.object({
  branchNumber: branchSelectionSchema.shape.branchNumber,
  ttn: z
    .string()
    .trim()
    .min(4, "validation.ttn.short")
    .max(128, "validation.ttn.long")
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
  .int("validation.parcelId.integer")
  .positive("validation.parcelId.positive");
