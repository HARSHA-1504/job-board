import type { Job } from "./nexora";

export const applicationStatuses = [
  "Applied",
  "Interviewing",
  "Offered",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export type ApplicationRecord = {
  id: string;
  job: Job;
  status: ApplicationStatus;
  notes: string;
  updatedAt: string;
};

export function createApplication(
  job: Job,
  now: string,
  id: string
): ApplicationRecord {
  return { id, job, status: "Applied", notes: "", updatedAt: now };
}

export function updateApplication(
  record: ApplicationRecord,
  updates: Pick<Partial<ApplicationRecord>, "status" | "notes">,
  now: string
): ApplicationRecord {
  return { ...record, ...updates, updatedAt: now };
}
