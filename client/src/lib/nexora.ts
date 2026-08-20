import type { Job, UserProfileDraft } from "../../../shared/nexora";

export type SavedJob = { job: Job; savedAt: string };
export type ApplicationRecord = {
  id: string;
  job: Job;
  status: "Applied" | "Interviewing" | "Offered" | "Rejected";
  notes: string;
  updatedAt: string;
};

export const defaultProfile: UserProfileDraft = {
  name: "Alex Morgan",
  location: "Hyderabad, India",
  experienceLevel: "entry",
  skills: ["Python", "SQL", "React", "Git"],
  preferredRoles: ["Software Engineer", "Data Analyst"],
  preferredLocations: ["Hyderabad", "Remote"],
  workMode: "hybrid",
};

export function formatSalary(job: Job) {
  if (!job.salaryMin || !job.salaryMax) return "Salary not specified";
  if (job.currency === "INR" && job.salaryMax >= 100000)
    return `₹${(job.salaryMin / 100000).toFixed(1)}–${(job.salaryMax / 100000).toFixed(1)} LPA`;
  return `${job.currency} ${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}`;
}

export function relativeDate(iso: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  );
  return days === 0
    ? "Posted today"
    : days === 1
      ? "Posted yesterday"
      : `Posted ${days}d ago`;
}

export function profileMatchPreview(job: Job, profile: UserProfileDraft) {
  const overlap = job.skills.filter(skill =>
    profile.skills.some(
      profileSkill => profileSkill.toLowerCase() === skill.toLowerCase()
    )
  );
  return {
    score: Math.min(
      96,
      54 +
        overlap.length * 9 +
        (job.experienceLevel === profile.experienceLevel ? 8 : 0)
    ),
    overlap,
  };
}
