import type { Parcel, ParcelStatus } from "./types";

export const parcelStatusOptions: ParcelStatus[] = [
  "in_storage",
  "delivered",
  "returned",
  "rejected",
  "absent",
  "new",
];

const terminalStatuses = new Set<ParcelStatus>([
  "delivered",
  "returned",
  "rejected",
]);

const TTN_FORMAT_REGEX = /^[A-Z0-9-]+$/;
export const STORAGE_REMINDER_DAYS = 7;

export function normalizeTtn(ttn: string) {
  return ttn.trim().toUpperCase();
}

export function getTtnValidationErrorKey(ttn: string) {
  const normalized = normalizeTtn(ttn);

  if (!normalized) {
    return "validation.ttn.required";
  }

  if (normalized.length < 4) {
    return "validation.ttn.short";
  }

  if (normalized.length > 128) {
    return "validation.ttn.long";
  }

  if (!TTN_FORMAT_REGEX.test(normalized)) {
    return "validation.ttn.invalid";
  }

  return null;
}

export function isParcelOverdue(parcel: Pick<Parcel, "createdAt" | "status">) {
  if (terminalStatuses.has(parcel.status)) {
    return false;
  }

  const createdAt =
    parcel.createdAt instanceof Date
      ? parcel.createdAt
      : new Date(parcel.createdAt);

  if (Number.isNaN(createdAt.getTime())) {
    return false;
  }

  const elapsedMs = Date.now() - createdAt.getTime();
  return elapsedMs >= STORAGE_REMINDER_DAYS * 24 * 60 * 60 * 1000;
}
