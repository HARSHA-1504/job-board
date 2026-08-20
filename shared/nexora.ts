export const APPLICATION_STATUSES = [
  "Applied",
  "Interviewing",
  "Offered",
  "Rejected",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const WORK_MODES = ["remote", "hybrid", "onsite", "any"] as const;
export type WorkMode = (typeof WORK_MODES)[number];

export const SENIORITY_LEVELS = [
  "intern",
  "entry",
  "mid",
  "senior",
  "lead",
  "any",
] as const;
export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number];

export const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "any",
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  workMode: Exclude<WorkMode, "any">;
  jobType: Exclude<JobType, "any">;
  experienceLevel: Exclude<SeniorityLevel, "any">;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  description: string;
  skills: string[];
  postedAt: string;
  source: string;
  applyUrl: string;
  featured?: boolean;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  skills?: string[];
  workMode?: WorkMode;
  jobType?: JobType;
  seniority?: SeniorityLevel;
  salaryMin?: number;
  sort?: "relevance" | "newest" | "salary";
}

export interface SearchIntent {
  role: string;
  location: string;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  workType: JobType;
  workMode: WorkMode;
  seniority: SeniorityLevel;
  confidence: number;
}

export interface UserProfileDraft {
  name: string;
  location: string;
  experienceLevel: Exclude<SeniorityLevel, "any">;
  skills: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  workMode: WorkMode;
}

export interface CareerProfileRecord {
  profile: UserProfileDraft;
  resumeText: string;
  onboardingComplete: boolean;
}

export interface MatchInsight {
  matchScore: number;
  matchedSkills: string[];
  growthAreas: string[];
  explanation: string;
  source: "AI-estimated" | "Profile-based";
}

export interface ResumeAnalysis {
  skills: string[];
  experienceLevel: Exclude<SeniorityLevel, "any">;
  targetRoles: string[];
  summary: string;
  source: "AI-extracted" | "Resume-derived";
}

export interface ResumeMatchResult {
  analysis: ResumeAnalysis;
  matches: Array<{
    job: Job;
    insight: MatchInsight;
  }>;
}

export interface JobSummary {
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  experience: string;
  keySkills: string[];
  source: "AI-generated" | "Job data";
}

export interface JobProvider {
  searchJobs(params: JobSearchParams): Promise<Job[]>;
  getJob(id: string): Promise<Job | null>;
}
