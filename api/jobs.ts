import { DEMO_JOBS, filterDemoJobs } from "../shared/demoJobs";
import type { JobSearchParams } from "../shared/nexora";

function readParams(url: URL): JobSearchParams {
  const skills = url.searchParams.get("skills");
  const salaryMin = url.searchParams.get("salaryMin");
  return {
    query: url.searchParams.get("query") ?? undefined,
    location: url.searchParams.get("location") ?? undefined,
    skills: skills ? skills.split(",").filter(Boolean) : undefined,
    workMode: (url.searchParams.get("workMode") as JobSearchParams["workMode"]) ?? undefined,
    jobType: (url.searchParams.get("jobType") as JobSearchParams["jobType"]) ?? undefined,
    seniority: (url.searchParams.get("seniority") as JobSearchParams["seniority"]) ?? undefined,
    salaryMin: salaryMin ? Number(salaryMin) : undefined,
    sort: (url.searchParams.get("sort") as JobSearchParams["sort"]) ?? "relevance",
  };
}

export default function handler(request: Request): Response {
  const jobs = filterDemoJobs(DEMO_JOBS, readParams(new URL(request.url)));
  return new Response(JSON.stringify(jobs), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
