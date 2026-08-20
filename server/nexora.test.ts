import { describe, expect, it } from "vitest";
import { DEMO_JOBS, filterDemoJobs } from "./nexoraData";
import {
  fallbackMatch,
  fallbackResumeAnalysis,
  fallbackSearchIntent,
} from "./nexoraService";
import { defaultProfile } from "../client/src/lib/nexora";
import {
  createApplication,
  updateApplication,
} from "../shared/applicationTracker";
import { calculateCareerMomentum } from "../shared/dashboardMetrics";
import {
  getCareerProfileCompletionIssues,
  isCareerProfileReady,
} from "../shared/careerProfile";
import { getPostSignInRoute } from "../shared/onboarding";

describe("NEXORA job discovery", () => {
  it("filters normalized jobs by a multi-skill query and work mode", () => {
    const jobs = filterDemoJobs(DEMO_JOBS, {
      query: "Python",
      skills: ["Python"],
      workMode: "remote",
      sort: "relevance",
    });

    expect(jobs.map(job => job.id)).toEqual(["nx-orbit-ml"]);
  });

  it("sorts normalized jobs by salary without relying on provider-specific data", () => {
    const jobs = filterDemoJobs(DEMO_JOBS, { sort: "salary" });

    expect(jobs[0]?.id).toBe("nx-fractal-react");
    expect(jobs[0]?.salaryMax).toBeGreaterThanOrEqual(jobs[1]?.salaryMax ?? 0);
  });

  it("includes the expanded 29-role catalogue across multiple job families", () => {
    expect(DEMO_JOBS).toHaveLength(29);
    expect(DEMO_JOBS.map(job => job.title)).toEqual(
      expect.arrayContaining([
        "UX Researcher",
        "DevOps Engineer",
        "Technical Writer",
        "Solutions Architect",
      ])
    );
    expect(new Set(DEMO_JOBS.map(job => job.id)).size).toBe(29);
  });

  it("extracts a safe search intent when the LLM is unavailable", () => {
    const intent = fallbackSearchIntent(
      "I want a remote React internship in Hyderabad at 8 LPA"
    );

    expect(intent).toMatchObject({
      role: "Frontend Engineer",
      location: "Anywhere",
      workMode: "remote",
      workType: "internship",
      seniority: "intern",
      salaryMin: 800000,
    });
    expect(intent.skills).toContain("React");
  });

  it("produces an explainable profile-based match without claiming certainty", () => {
    const job = DEMO_JOBS.find(item => item.id === "nx-aurora-python");
    if (!job) throw new Error("Expected demo job");

    const match = fallbackMatch(defaultProfile, job);

    expect(match.source).toBe("Profile-based");
    expect(match.matchScore).toBeGreaterThan(50);
    expect(match.matchedSkills).toEqual(
      expect.arrayContaining(["Python", "SQL", "Git"])
    );
    expect(match.explanation).toMatch(/profile/i);
  });

  it("creates and updates an application record with an exact status, note, and timestamp", () => {
    const job = DEMO_JOBS[0];
    const initialTime = "2026-08-20T09:00:00.000Z";
    const changedTime = "2026-08-21T10:15:00.000Z";
    const application = createApplication(job, initialTime, "application-1");
    const updated = updateApplication(
      application,
      { status: "Interviewing", notes: "Portfolio review booked for Tuesday." },
      changedTime
    );

    expect(application).toMatchObject({
      status: "Applied",
      notes: "",
      updatedAt: initialTime,
    });
    expect(updated).toMatchObject({
      id: "application-1",
      status: "Interviewing",
      notes: "Portfolio review booked for Tuesday.",
      updatedAt: changedTime,
    });
  });

  it("derives explainable resume signals that can be used to rank suitable roles without an AI response", () => {
    const analysis = fallbackResumeAnalysis(
      "Frontend developer with 3 years of React, TypeScript, CSS, Git, and REST APIs experience. I collaborate with design teams and ship accessible interfaces."
    );

    expect(analysis.source).toBe("Resume-derived");
    expect(analysis.experienceLevel).toBe("mid");
    expect(analysis.skills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "CSS", "Git"])
    );
    expect(analysis.targetRoles).toContain("Frontend Engineer");
  });

  it("calculates dashboard momentum from saved roles and application progress", () => {
    expect(
      calculateCareerMomentum({
        savedCount: 2,
        applicationCount: 3,
        interviewingCount: 1,
      })
    ).toBe(84);
    expect(
      calculateCareerMomentum({
        savedCount: 12,
        applicationCount: 10,
        interviewingCount: 8,
      })
    ).toBe(100);
  });

  it("requires one complete shared onboarding record before career matching is enabled", () => {
    const incomplete = {
      profile: defaultProfile,
      resumeText: "",
      updatedAt: "2026-08-20T10:00:00.000Z",
    };
    const complete = {
      ...incomplete,
      resumeText:
        "Frontend developer with React, TypeScript, accessible UI delivery, and three years of product experience.",
    };

    expect(isCareerProfileReady(incomplete)).toBe(false);
    expect(isCareerProfileReady(complete)).toBe(true);
  });

  it("recognizes comma-separated skills and identifies a short resume without blaming skills", () => {
    const record = {
      profile: {
        ...defaultProfile,
        skills: ["Python", "SQL", "React", "Git", "Java"],
      },
      resumeText: "e-commerce website",
      updatedAt: "2026-08-20T10:00:00.000Z",
    };

    const issues = getCareerProfileCompletionIssues(record);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/more resume characters/i);
    expect(issues.join(" ")).not.toMatch(/core skill/i);
  });

  it("routes a newly signed-in user to the single setup flow and a complete user to the dashboard", () => {
    expect(getPostSignInRoute(false, false)).toBe("/");
    expect(getPostSignInRoute(true, false)).toBe("/onboarding");
    expect(getPostSignInRoute(true, true)).toBe("/dashboard");
  });
});
