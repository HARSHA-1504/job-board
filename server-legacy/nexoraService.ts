import { invokeLLM, listLLMModels } from "./_core/llm";
import type {
  Job,
  JobSummary,
  MatchInsight,
  ResumeAnalysis,
  ResumeMatchResult,
  SearchIntent,
  UserProfileDraft,
} from "../shared/nexora";

const positiveSkill = (skill: string, profile: UserProfileDraft) =>
  profile.skills.some(
    profileSkill => profileSkill.toLowerCase() === skill.toLowerCase()
  );

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

function cleanJson(value: unknown) {
  if (typeof value !== "string")
    throw new Error("The AI response did not contain usable content.");
  return JSON.parse(
    value
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim()
  );
}

function within<T>(operation: Promise<T>, milliseconds: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("The AI request exceeded the response budget.")),
      milliseconds
    );
  });
  return Promise.race([operation, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

async function preferredModel() {
  const catalog = await listLLMModels();
  return (
    catalog.data.find(model => model.id === "gpt-5-mini")?.id ??
    catalog.data[0]?.id
  );
}

export function fallbackSearchIntent(query: string): SearchIntent {
  const lower = query.toLowerCase();
  const location = lower.includes("remote")
    ? "Anywhere"
    : (knownLocations.find(place => lower.includes(place.toLowerCase())) ??
      "Anywhere");
  const skills = knownSkills.filter(skill =>
    lower.includes(skill.toLowerCase())
  );
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
  };
}

export async function interpretSearchIntent(
  query: string
): Promise<SearchIntent> {
  const fallback = fallbackSearchIntent(query);
  try {
    const model = await preferredModel();
    if (!model) return fallback;
    const response = await invokeLLM({
      model,
      messages: [
        {
          role: "system",
          content:
            "You extract job-search intent. Use only information in the query. Return unknown values as defaults. Do not invent a company, job, compensation, requirement, or location.",
        },
        { role: "user", content: query },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_search_intent",
          strict: true,
          schema: {
            type: "object",
            properties: {
              role: { type: "string" },
              location: { type: "string" },
              skills: { type: "array", items: { type: "string" } },
              salaryMin: { type: ["number", "null"] },
              salaryMax: { type: ["number", "null"] },
              workType: {
                type: "string",
                enum: [
                  "full-time",
                  "part-time",
                  "contract",
                  "internship",
                  "any",
                ],
              },
              workMode: {
                type: "string",
                enum: ["remote", "hybrid", "onsite", "any"],
              },
              seniority: {
                type: "string",
                enum: ["intern", "entry", "mid", "senior", "lead", "any"],
              },
              confidence: { type: "number" },
            },
            required: [
              "role",
              "location",
              "skills",
              "salaryMin",
              "salaryMax",
              "workType",
              "workMode",
              "seniority",
              "confidence",
            ],
            additionalProperties: false,
          },
        },
      },
    });
    const parsed = cleanJson(
      response.choices[0]?.message.content
    ) as SearchIntent;
    return {
      ...fallback,
      ...parsed,
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
    };
  } catch {
    return fallback;
  }
}

export function fallbackMatch(
  profile: UserProfileDraft,
  job: Job
): MatchInsight {
  const matchedSkills = job.skills.filter(skill =>
    positiveSkill(skill, profile)
  );
  const growthAreas = job.skills
    .filter(skill => !positiveSkill(skill, profile))
    .slice(0, 3);
  const locationFit =
    profile.workMode === "any" ||
    profile.workMode === job.workMode ||
    (profile.workMode === "remote" && job.remote)
      ? 10
      : 0;
  const experienceFit =
    profile.experienceLevel === job.experienceLevel ? 16 : 7;
  const roleFit = profile.preferredRoles.some(role =>
    job.title.toLowerCase().includes(role.toLowerCase())
  )
    ? 12
    : 0;
  const matchScore = Math.min(
    98,
    Math.max(
      34,
      36 +
        Math.round(
          (matchedSkills.length / Math.max(1, job.skills.length)) * 36
        ) +
        locationFit +
        experienceFit +
        roleFit
    )
  );
  const shared = matchedSkills.length
    ? `${matchedSkills.slice(0, 3).join(", ")} align with the core work`
    : "your profile has adjacent strengths for the role";
  const gap = growthAreas.length
    ? ` Building familiarity with ${growthAreas.slice(0, 2).join(" and ")} would strengthen the match.`
    : "";
  return {
    matchScore,
    matchedSkills,
    growthAreas,
    explanation: `Your profile stands out because ${shared}.${gap}`,
    source: "Profile-based",
  };
}

export function fallbackResumeAnalysis(resumeText: string): ResumeAnalysis {
  const normalized = resumeText.toLowerCase();
  const skills = Array.from(
    new Set(
      resumeSkillVocabulary.filter(skill =>
        normalized.includes(skill.toLowerCase())
      )
    )
  );
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
    /python|machine learning|ai/.test(normalized)
      ? "Machine Learning Engineer"
      : null,
  ].filter((role): role is string => Boolean(role));
  const focus = skills.length
    ? `${skills.slice(0, 5).join(", ")} surface as the strongest resume signals.`
    : "The resume provides a broad starting point for role exploration.";
  return {
    skills,
    experienceLevel,
    targetRoles: targetRoles.length ? targetRoles : ["Software Engineer"],
    summary: `${focus} NEXORA ranked available roles by stated experience and overlapping job requirements.`,
    source: "Resume-derived",
  };
}

function fallbackResumeMatches(
  analysis: ResumeAnalysis,
  jobs: Job[],
  limit: number
): ResumeMatchResult {
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
  return { analysis, matches };
}

export async function matchResumeToJobs(
  resumeText: string,
  jobs: Job[],
  limit: number
): Promise<ResumeMatchResult> {
  const fallbackAnalysis = fallbackResumeAnalysis(resumeText);
  const fallback = fallbackResumeMatches(fallbackAnalysis, jobs, limit);
  if (!jobs.length) return fallback;
  try {
    const model = await within(preferredModel(), 2500);
    if (!model) return fallback;
    const request = invokeLLM({
      model,
      messages: [
        {
          role: "system",
          content:
            "Extract only evidence present in the supplied resume and compare it with the supplied jobs. Return the strongest suitable roles, not an employment guarantee. Do not invent employers, credentials, locations, years, or skills.",
        },
        {
          role: "user",
          content: JSON.stringify({
            resume: resumeText,
            jobs: jobs.map(job => ({
              id: job.id,
              title: job.title,
              company: job.company,
              experienceLevel: job.experienceLevel,
              workMode: job.workMode,
              skills: job.skills,
              description: job.description,
            })),
          }),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_job_match",
          strict: true,
          schema: {
            type: "object",
            properties: {
              skills: { type: "array", items: { type: "string" } },
              experienceLevel: {
                type: "string",
                enum: ["intern", "entry", "mid", "senior", "lead"],
              },
              targetRoles: { type: "array", items: { type: "string" } },
              summary: { type: "string" },
              matches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    jobId: { type: "string" },
                    matchScore: { type: "integer", minimum: 0, maximum: 100 },
                    matchedSkills: { type: "array", items: { type: "string" } },
                    growthAreas: { type: "array", items: { type: "string" } },
                    explanation: { type: "string" },
                  },
                  required: [
                    "jobId",
                    "matchScore",
                    "matchedSkills",
                    "growthAreas",
                    "explanation",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: [
              "skills",
              "experienceLevel",
              "targetRoles",
              "summary",
              "matches",
            ],
            additionalProperties: false,
          },
        },
      },
    });
    const response = await within(request, 7000);
    const parsed = cleanJson(response.choices[0]?.message.content) as {
      skills: string[];
      experienceLevel: ResumeAnalysis["experienceLevel"];
      targetRoles: string[];
      summary: string;
      matches: Array<MatchInsight & { jobId: string }>;
    };
    const byId = new Map(jobs.map(job => [job.id, job]));
    const matches = parsed.matches
      .filter(match => byId.has(match.jobId))
      .sort((left, right) => right.matchScore - left.matchScore)
      .slice(0, limit)
      .map(match => ({
        job: byId.get(match.jobId) as Job,
        insight: {
          matchScore: Math.max(0, Math.min(100, match.matchScore)),
          matchedSkills: match.matchedSkills,
          growthAreas: match.growthAreas,
          explanation: match.explanation,
          source: "AI-estimated" as const,
        },
      }));
    return {
      analysis: {
        skills: parsed.skills,
        experienceLevel: parsed.experienceLevel,
        targetRoles: parsed.targetRoles,
        summary: parsed.summary,
        source: "AI-extracted",
      },
      matches: matches.length ? matches : fallback.matches,
    };
  } catch {
    return fallback;
  }
}

export async function generateMatchInsight(
  profile: UserProfileDraft,
  job: Job
): Promise<MatchInsight> {
  const fallback = fallbackMatch(profile, job);
  try {
    const model = await preferredModel();
    if (!model) return fallback;
    const response = await invokeLLM({
      model,
      messages: [
        {
          role: "system",
          content:
            "Compare only the supplied profile with the supplied job. Produce an AI-estimated match, never claim certainty or invent facts. Keep the explanation concise and grounded in skills, role, seniority, work mode, and location.",
        },
        {
          role: "user",
          content: JSON.stringify({
            profile,
            job: {
              title: job.title,
              location: job.location,
              workMode: job.workMode,
              experienceLevel: job.experienceLevel,
              skills: job.skills,
              description: job.description,
            },
          }),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_match",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matchScore: { type: "integer", minimum: 0, maximum: 100 },
              matchedSkills: { type: "array", items: { type: "string" } },
              growthAreas: { type: "array", items: { type: "string" } },
              explanation: { type: "string" },
            },
            required: [
              "matchScore",
              "matchedSkills",
              "growthAreas",
              "explanation",
            ],
            additionalProperties: false,
          },
        },
      },
    });
    const parsed = cleanJson(response.choices[0]?.message.content) as Omit<
      MatchInsight,
      "source"
    >;
    return {
      ...fallback,
      ...parsed,
      matchScore: Math.max(0, Math.min(100, parsed.matchScore)),
      source: "AI-estimated",
    };
  } catch {
    return fallback;
  }
}

export async function generateMatchInsights(
  profile: UserProfileDraft,
  jobs: Job[]
): Promise<MatchInsight[]> {
  const fallback = jobs.map(job => fallbackMatch(profile, job));
  if (!jobs.length) return fallback;
  try {
    const model = await within(preferredModel(), 2500);
    if (!model) return fallback;
    const request = invokeLLM({
      model,
      messages: [
        {
          role: "system",
          content:
            "Compare only the supplied profile with each supplied job. Return one concise AI-estimated match per job. Never claim certainty or invent facts. Ground every explanation in supplied skills, role, seniority, work mode, or location.",
        },
        {
          role: "user",
          content: JSON.stringify({
            profile,
            jobs: jobs.map(job => ({
              id: job.id,
              title: job.title,
              location: job.location,
              workMode: job.workMode,
              experienceLevel: job.experienceLevel,
              skills: job.skills,
              description: job.description,
            })),
          }),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_match_batch",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    jobId: { type: "string" },
                    matchScore: { type: "integer", minimum: 0, maximum: 100 },
                    matchedSkills: {
                      type: "array",
                      items: { type: "string" },
                    },
                    growthAreas: {
                      type: "array",
                      items: { type: "string" },
                    },
                    explanation: { type: "string" },
                  },
                  required: [
                    "jobId",
                    "matchScore",
                    "matchedSkills",
                    "growthAreas",
                    "explanation",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["matches"],
            additionalProperties: false,
          },
        },
      },
    });
    const response = await within(request, 6500);
    const parsed = cleanJson(response.choices[0]?.message.content) as {
      matches: Array<MatchInsight & { jobId: string }>;
    };
    const validIds = new Set(jobs.map(job => job.id));
    const byId = new Map(
      parsed.matches
        .filter(item => validIds.has(item.jobId))
        .map(item => [
          item.jobId,
          {
            matchScore: Math.max(0, Math.min(100, item.matchScore)),
            matchedSkills: item.matchedSkills,
            growthAreas: item.growthAreas,
            explanation: item.explanation,
            source: "AI-estimated" as const,
          },
        ])
    );
    return jobs.map((job, index) => byId.get(job.id) ?? fallback[index]);
  } catch {
    return fallback;
  }
}

export function fallbackSummary(job: Job): JobSummary {
  const sentences = job.description.split(/(?<=[.!?])\s+/).filter(Boolean);
  return {
    summary: sentences.slice(0, 2).join(" "),
    responsibilities: sentences.slice(0, 2),
    requirements: job.skills.slice(0, 4),
    niceToHave: job.skills.slice(4),
    experience:
      job.experienceLevel === "entry"
        ? "Suitable for early-career candidates."
        : `Designed for ${job.experienceLevel}-level candidates.`,
    keySkills: job.skills,
    source: "Job data",
  };
}

export async function summarizeJob(job: Job): Promise<JobSummary> {
  const fallback = fallbackSummary(job);
  try {
    const model = await preferredModel();
    if (!model) return fallback;
    const response = await invokeLLM({
      model,
      messages: [
        {
          role: "system",
          content:
            "Summarize only the supplied job description. Do not invent employer information, salary, benefits, requirements, location, or skills. Where details are absent, say exactly: Not specified in the available job data.",
        },
        { role: "user", content: job.description },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_summary",
          strict: true,
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              responsibilities: { type: "array", items: { type: "string" } },
              requirements: { type: "array", items: { type: "string" } },
              niceToHave: { type: "array", items: { type: "string" } },
              experience: { type: "string" },
              keySkills: { type: "array", items: { type: "string" } },
            },
            required: [
              "summary",
              "responsibilities",
              "requirements",
              "niceToHave",
              "experience",
              "keySkills",
            ],
            additionalProperties: false,
          },
        },
      },
    });
    return {
      ...(cleanJson(response.choices[0]?.message.content) as Omit<
        JobSummary,
        "source"
      >),
      source: "AI-generated",
    };
  } catch {
    return fallback;
  }
}
