import { and, eq } from "drizzle-orm";
import { jobs } from "../drizzle/schema";
import type { Job, JobSearchParams } from "../shared/nexora";
import { getDb } from "./db";
import { DEMO_JOBS, filterDemoJobs } from "./nexoraData";

function toJob(record: typeof jobs.$inferSelect): Job {
  return {
    id: record.id,
    title: record.title,
    company: record.company,
    companyLogo: record.companyLogo ?? undefined,
    location: record.location,
    remote: Boolean(record.remote),
    workMode: record.workMode as Job["workMode"],
    jobType: record.jobType as Job["jobType"],
    experienceLevel: record.experienceLevel as Job["experienceLevel"],
    salaryMin: record.salaryMin ?? undefined,
    salaryMax: record.salaryMax ?? undefined,
    currency: record.currency,
    description: record.description,
    skills: (record.skills as string[]) ?? [],
    postedAt: record.postedAt.toISOString(),
    source: record.source,
    applyUrl: record.applyUrl,
    featured: Boolean(record.featured),
  };
}

export async function ensureDemoJobs(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ id: jobs.id }).from(jobs);
  const existingIds = new Set(existing.map(job => job.id));
  const missingJobs = DEMO_JOBS.filter(job => !existingIds.has(job.id));
  if (!missingJobs.length) return;
  await db.insert(jobs).values(
    missingJobs.map(job => ({
      ...job,
      remote: job.remote ? 1 : 0,
      featured: job.featured ? 1 : 0,
      postedAt: new Date(job.postedAt),
    }))
  );
}

export async function listNexoraJobs(params: JobSearchParams): Promise<Job[]> {
  try {
    await ensureDemoJobs();
    const db = await getDb();
    if (!db) return filterDemoJobs(DEMO_JOBS, params);
    const allJobs = (await db.select().from(jobs)).map(toJob);
    return filterDemoJobs(allJobs, params);
  } catch {
    return filterDemoJobs(DEMO_JOBS, params);
  }
}

export async function findNexoraJob(id: string): Promise<Job | null> {
  try {
    await ensureDemoJobs();
    const db = await getDb();
    if (!db) return DEMO_JOBS.find(job => job.id === id) ?? null;
    const result = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id)))
      .limit(1);
    return result[0] ? toJob(result[0]) : null;
  } catch {
    return DEMO_JOBS.find(job => job.id === id) ?? null;
  }
}
