import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { DEMO_JOBS, filterDemoJobs } from "../../shared/demoJobs";
import type {
  JobSearchParams,
  SearchIntent,
  UserProfileDraft,
  Job,
  ResumeAnalysis,
  ResumeMatchResult,
  MatchInsight,
  JobSummary,
} from "../../shared/nexora";
import { TRPCError } from "@trpc/server";

const t = initTRPC.create({ transformer: superjson });

const router = t.router;
const publicProcedure = t.procedure;

const knownLocations = [
  "Hyderabad",
  "Bengaluru",
  "Bangalore",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Pune",
];
const knownSkills = [
  "Python",
  "SQL",
  "React",
  "Java",
  "TypeScript",
  "Machine Learning",
  "AWS",
  "Docker",
  "Figma",
  "Tableau",
  "Spring Boot",
];
const resumeSkillVocabulary = [
  ...knownSkills,
  "Node.js",
  "PostgreSQL",
  "Kubernetes",
  "Playwright",
  "User Research",
  "Product Strategy",
  "Communication",
  "Excel",
  "SEO",
  "Swift",
  "C++",
  "Technical Writing",
  "Salesforce",
  "CSS",
  "Git",
  "REST APIs",
  "Figma",
];

const includesText = (value: string, needle: string) =>
  value.toLowerCase().includes(needle.toLowerCase());

export function fallbackSearchIntent(query: string): SearchIntent {
  const lower = query.toLowerCase();
  const location = lower.includes("remote")
    ? "Anywhere"
    : (knownLocations.find(place => lower.includes(place.toLowerCase())) ?? "Anywhere");
  const skills = knownSkills.filter(skill => lower.includes(skill.toLowerCase()));
  const workMode = lower.includes("remote")
    ? "remote"
    : lower.includes("hybrid")
      ? "hybrid"
      : lower.includes("onsite") || lower.includes("on-site")
        ? "onsite"
        : "any";
  const workType = lower.includes("intern")
    ? "internship"
    : lower.includes("contract")
      ? "contract"
      : lower.includes("part time")
        ? "part-time"
        : "any";
  const seniority = lower.includes("intern")
    ? "intern"
    : /fresher|entry|graduate|without experience/.test(lower)
      ? "entry"
      : /senior|lead/.test(lower)
        ? "senior"
        : /mid|2\+ years|3\+ years/.test(lower)
          ? "mid"
          : "any";
  const role = /data analyst/.test(lower)
    ? "Data Analyst"
    : /machine learning|ai\/?ml/.test(lower)
      ? "Machine Learning"
      : /frontend|react/.test(lower)
        ? "Frontend Engineer"
        : /java/.test(lower)
          ? "Java Engineer"
          : /design/.test(lower)
            ? "Product Designer"
            : /content/.test(lower)
              ? "Content Strategy"
              : /cloud|devops/.test(lower)
                ? "Cloud Operations"
                : "Software Engineer";
  const lakhMatch = lower.match(/(\d+)\s*(?:lpa|lakh)/);
  const salaryMin = lakhMatch ? Number(lakhMatch[1]) * 100000 : null;
  return {
    role,
    location,
    skills,
    salaryMin,
    salaryMax: null,
    workType,
    workMode,
    seniority,
    confidence: 0.72,
  } as SearchIntent;
}

const positiveSkill = (skill: string, profile: UserProfileDraft) =>
  profile.skills.some(profileSkill => profileSkill.toLowerCase() === skill.toLowerCase());

export function fallbackMatch(profile: UserProfileDraft, job: Job): MatchInsight {
  const matchedSkills = job.skills.filter(skill => positiveSkill(skill, profile));
  const growthAreas = job.skills.filter(skill => !positiveSkill(skill, profile)).slice(0, 3);
  const locationFit =
    profile.workMode === "any" ||
    profile.workMode === job.workMode ||
    (profile.workMode === "remote" && job.remote)
      ? 10
      : 0;
  const experienceFit = profile.experienceLevel === job.experienceLevel ? 16 : 7;
  const roleFit = profile.preferredRoles.some(role => job.title.toLowerCase().includes(role.toLowerCase())) ? 12 : 0;
  const matchScore = Math.min(
    98,
    Math.max(
      34,
      36 + Math.round((matchedSkills.length / Math.max(1, job.skills.length)) * 36) + locationFit + experienceFit + roleFit
    )
  );
  const shared = matchedSkills.length ? `${matchedSkills.slice(0, 3).join(", ")} align with the core work` : "your profile has adjacent strengths for the role";
  const gap = growthAreas.length ? ` Building familiarity with ${growthAreas.slice(0, 2).join(" and ")} would strengthen the match.` : "";
  return {
    matchScore,
    matchedSkills,
    growthAreas,
    explanation: `Your profile stands out because ${shared}.${gap}`,
    source: "Profile-based",
  } as MatchInsight;
}

export function fallbackResumeAnalysis(resumeText: string): ResumeAnalysis {
  const normalized = resumeText.toLowerCase();
  const skills = Array.from(new Set(resumeSkillVocabulary.filter(skill => normalized.includes(skill.toLowerCase()))));
  const yearsMatch = normalized.match(/(\d{1,2})\+?\s*(?:years?|yrs?)/);
  const years = yearsMatch ? Number(yearsMatch[1]) : 0;
  const experienceLevel =
    /lead|principal|architect|manager/.test(normalized) || years >= 7
      ? "lead"
      : /senior/.test(normalized) || years >= 4
        ? "senior"
        : years >= 2
          ? "mid"
          : /intern|student/.test(normalized)
            ? "intern"
            : "entry";
  const targetRoles = [
    /frontend|react/.test(normalized) ? "Frontend Engineer" : null,
    /data|sql|analytics/.test(normalized) ? "Data Analyst" : null,
    /product|roadmap/.test(normalized) ? "Product Manager" : null,
    /design|figma/.test(normalized) ? "Product Designer" : null,
    /java|backend|api/.test(normalized) ? "Backend Engineer" : null,
    /python|machine learning|ai/.test(normalized) ? "Machine Learning Engineer" : null,
  ].filter((role): role is string => Boolean(role));
  const focus = skills.length ? `${skills.slice(0, 5).join(", ")} surface as the strongest resume signals.` : "The resume provides a broad starting point for role exploration.";
  return {
    skills,
    experienceLevel: experienceLevel as any,
    targetRoles: targetRoles.length ? targetRoles : ["Software Engineer"],
    summary: `${focus} NEXORA ranked available roles by stated experience and overlapping job requirements.`,
    source: "Resume-derived",
  } as ResumeAnalysis;
}

function fallbackResumeMatches(analysis: ResumeAnalysis, jobs: Job[], limit: number): ResumeMatchResult {
  const resumeProfile: UserProfileDraft = {
    name: "Resume candidate",
    location: "",
    experienceLevel: analysis.experienceLevel,
    skills: analysis.skills,
    preferredRoles: analysis.targetRoles,
    preferredLocations: [],
    workMode: "any",
  };
  const matches = jobs
    .map(job => ({ job, insight: fallbackMatch(resumeProfile, job) }))
    .sort((left, right) => right.insight.matchScore - left.insight.matchScore)
    .slice(0, limit);
  return { analysis, matches } as ResumeMatchResult;
}

export function fallbackSummary(job: Job): JobSummary {
  const sentences = job.description.split(/(?<=[.!?])\s+/).filter(Boolean);
  return {
    summary: sentences.slice(0, 2).join(" "),
    responsibilities: sentences.slice(0, 2),
    requirements: job.skills.slice(0, 4),
    niceToHave: job.skills.slice(4),
    experience: job.experienceLevel === "entry" ? "Suitable for early-career candidates." : `Designed for ${job.experienceLevel}-level candidates.`,
    keySkills: job.skills,
    source: "Job data",
  } as JobSummary;
}

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(() => null),
    logout: publicProcedure.mutation(() => ({ success: true })),
  }),
  nexora: router({
    listJobs: publicProcedure
      .input(
        z.object({
          query: z.string().trim().max(200).optional(),
          location: z.string().trim().max(120).optional(),
          skills: z.array(z.string().trim().max(64)).max(10).optional(),
          workMode: z.enum(["remote", "hybrid", "onsite", "any"]).optional(),
          jobType: z
            .enum(["full-time", "part-time", "contract", "internship", "any"])
            .optional(),
          seniority: z
            .enum(["intern", "entry", "mid", "senior", "lead", "any"])
            .optional(),
          salaryMin: z.number().int().min(0).max(50000000).optional(),
          sort: z.enum(["relevance", "newest", "salary"]).optional(),
        })
      )
      .query(({ input }) => {
        const params = (input ?? {}) as JobSearchParams;
        return filterDemoJobs(DEMO_JOBS, params);
      }),
    getJob: publicProcedure
      .input(z.object({ id: z.string().min(1).max(96) }))
      .query(({ input }) => DEMO_JOBS.find(j => j.id === input.id) ?? null),
    interpretSearch: publicProcedure
      .input(z.object({ query: z.string().trim().min(3).max(300) }))
      .mutation(({ input }) => fallbackSearchIntent(input.query)),
    matchJob: publicProcedure
      .input(z.object({ jobId: z.string().min(1).max(96), profile: z.any() }))
      .mutation(({ input }) => {
        const job = DEMO_JOBS.find(j => j.id === (input as any).jobId);
        if (!job) throw new TRPCError({ code: "NOT_FOUND" });
        return fallbackMatch((input as any).profile as UserProfileDraft, job);
      }),
    matchJobs: publicProcedure
      .input(z.object({ jobIds: z.array(z.string().min(1).max(96)).min(1).max(12), profile: z.any() }))
      .mutation(({ input }) => {
        const ids = (input as any).jobIds as string[];
        const profile = (input as any).profile as UserProfileDraft;
        const jobs = ids.map(id => DEMO_JOBS.find(j => j.id === id)).filter(Boolean) as Job[];
        return jobs.map(job => fallbackMatch(profile, job));
      }),
    matchResume: publicProcedure
      .input(z.object({ resumeText: z.string().trim().min(40).max(20000), limit: z.number().int().min(3).max(8).default(6) }))
      .mutation(({ input }) => {
        const { resumeText, limit } = input as any;
        const analysis = fallbackResumeAnalysis(resumeText);
        const matches = fallbackResumeMatches(analysis, DEMO_JOBS, limit);
        return matches;
      }),
    summarizeJob: publicProcedure
      .input(z.object({ jobId: z.string().min(1).max(96) }))
      .mutation(({ input }) => {
        const job = DEMO_JOBS.find(j => j.id === input.jobId);
        if (!job) throw new TRPCError({ code: "NOT_FOUND" });
        return fallbackSummary(job);
      }),
  }),
});

export type AppRouter = typeof appRouter;
