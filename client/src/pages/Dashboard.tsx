import { AppShell, EmptyState } from "@/components/nexora";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useNexoraStorage } from "@/hooks/useNexoraStorage";
import { type ApplicationRecord, type SavedJob } from "@/lib/nexora";
import { trpc } from "@/lib/trpc";
import { DEMO_JOBS } from "../../../shared/demoJobs";
import { calculateCareerMomentum } from "../../../shared/dashboardMetrics";
import type { ResumeMatchResult } from "../../../shared/nexora";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  FileText,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Dashboard() {
  const [career] = useCareerProfile();
  const resumeText = career.resumeText;
  const [resumeResult, setResumeResult] = useState<ResumeMatchResult | null>(
    null
  );
  const [applications] = useNexoraStorage<ApplicationRecord[]>(
    "nexora.applications.v1",
    []
  );
  const [savedJobs] = useNexoraStorage<SavedJob[]>("nexora.saved.v1", []);
  const jobs = trpc.nexora.listJobs.useQuery({ sort: "newest" });
  const resumeMatcher = trpc.nexora.matchResume.useMutation({
    onSuccess: result => {
      setResumeResult(result);
      toast.success("Your resume signal is ready.");
    },
    onError: () =>
      toast.error("We could not analyse that resume. Please try again."),
  });

  const stageCounts = useMemo(
    () => ({
      Applied: applications.filter(item => item.status === "Applied").length,
      Interviewing: applications.filter(item => item.status === "Interviewing")
        .length,
      Offered: applications.filter(item => item.status === "Offered").length,
    }),
    [applications]
  );
  const momentum = calculateCareerMomentum({
    savedCount: savedJobs.length,
    applicationCount: applications.length,
    interviewingCount: stageCounts.Interviewing,
  });

  function matchResume() {
    if (resumeText.trim().length < 40) {
      toast.error("Add a little more resume detail before matching.");
      return;
    }
    resumeMatcher.mutate({ resumeText, limit: 6 });
  }

  return (
    <AppShell>
      <section className="command-dashboard">
        <div className="dashboard-hero depth-plane">
          <div>
            <p className="eyebrow">
              <Sparkles size={13} /> NEXORA COMMAND CENTER
            </p>
            <h1>
              Make the next move
              <br />
              <em>with signal, not noise.</em>
            </h1>
            <p className="dashboard-lede">
              A live view of your opportunity momentum, resume strengths, and
              the roles worth opening next.
            </p>
            <div className="dashboard-actions">
              <Link href="/discover" className="button-like primary-link">
                Explore role signals <ArrowUpRight size={16} />
              </Link>
              <Link href="/applications" className="button-like ghost-link">
                Open application flow
              </Link>
            </div>
          </div>
          <div
            className="orbit-stage"
            aria-label="Career momentum visualization"
          >
            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <div className="orbit-core">
              <span>{momentum}</span>
              <small>signal</small>
            </div>
            <div className="orbit-node node-one">
              <Target size={15} />
              <span>{savedJobs.length} saved</span>
            </div>
            <div className="orbit-node node-two">
              <BriefPulse value={applications.length} label="active" />
            </div>
            <div className="orbit-node node-three">
              <Trophy size={15} />
              <span>{stageCounts.Interviewing} interviews</span>
            </div>
          </div>
        </div>

        <section className="metric-ribbon" aria-label="Career metrics">
          <Metric
            icon={<Target size={18} />}
            value={jobs.data?.length ?? DEMO_JOBS.length}
            label="roles in your field"
            note="Expanded opportunity map"
          />
          <Metric
            icon={<FileText size={18} />}
            value={savedJobs.length}
            label="roles held in view"
            note="Your short list"
          />
          <Metric
            icon={<BarChart3 size={18} />}
            value={applications.length}
            label="applications moving"
            note={`${stageCounts.Interviewing} in interview stage`}
          />
          <Metric
            icon={<Trophy size={18} />}
            value={`${momentum}%`}
            label="career momentum"
            note="Based on current activity"
          />
        </section>

        <section className="dashboard-grid">
          <article className="resume-console glass-3d">
            <div className="panel-kicker">
              <BrainCircuit size={16} />
              <span>RESUME → ROLE SIGNAL</span>
              <i>AI-assisted</i>
            </div>
            <h2>Let your resume set the direction.</h2>
            <p>
              Paste your resume below. NEXORA extracts only stated evidence,
              then ranks the most suitable roles with a transparent explanation.
            </p>
            {resumeText ? (
              <textarea
                value={resumeText}
                readOnly
                aria-label="Your saved resume text"
              />
            ) : (
              <Link href="/onboarding" className="resume-empty-link">
                Add your resume to generate a role map{" "}
                <ArrowUpRight size={15} />
              </Link>
            )}
            <div className="resume-console-actions">
              <span>
                {resumeText.trim().length.toLocaleString()} characters
              </span>
              <Button
                onClick={matchResume}
                disabled={!resumeText || resumeMatcher.isPending}
              >
                <Sparkles size={16} />
                {resumeMatcher.isPending
                  ? "Mapping your signal…"
                  : "Match my resume"}
              </Button>
            </div>
          </article>

          <article className="trajectory-panel glass-3d">
            <div className="panel-kicker">
              <BarChart3 size={16} />
              <span>OPPORTUNITY TRAJECTORY</span>
            </div>
            <h2>Small actions, visible progress.</h2>
            <div
              className="trajectory-bars"
              aria-label="Application stage summary"
            >
              {(["Applied", "Interviewing", "Offered"] as const).map(
                (stage, index) => (
                  <div className="trajectory-row" key={stage}>
                    <span>{stage}</span>
                    <div>
                      <i
                        style={{
                          width: `${Math.max(8, Math.min(100, stageCounts[stage] * 30 + 8))}%`,
                        }}
                      />
                    </div>
                    <strong>{stageCounts[stage]}</strong>
                    <b style={{ transform: `translateY(${-index * 4}px)` }} />
                  </div>
                )
              )}
            </div>
            <div className="trajectory-foot">
              <span className="pulse-dot" /> Keep the signal fresh: save a role,
              then move it into your flow.
            </div>
          </article>
        </section>

        <section className="match-deck">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PERSONALIZED ROLE MAP</p>
              <h2>
                {resumeResult
                  ? "Your strongest next roles"
                  : "A clearer place to begin"}
              </h2>
            </div>
            <Link href="/discover">
              See all roles <ArrowUpRight size={15} />
            </Link>
          </div>
          {resumeResult ? (
            <>
              <div className="analysis-strip">
                <span className="analysis-orb">
                  <BrainCircuit size={15} />
                </span>
                <p>{resumeResult.analysis.summary}</p>
                <Badge variant="outline">
                  {resumeResult.analysis.source === "AI-extracted"
                    ? "AI-extracted"
                    : "Resume-derived"}
                </Badge>
              </div>
              <div className="match-role-grid">
                {resumeResult.matches.map(({ job, insight }, index) => (
                  <article
                    className="resume-role-card"
                    key={job.id}
                    style={{ "--card-index": index } as React.CSSProperties}
                  >
                    <div className="role-card-top">
                      <span className="company-monogram">
                        {job.company.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="score-chip">{insight.matchScore}%</span>
                    </div>
                    <h3>{job.title}</h3>
                    <p>
                      {job.company} · {job.location}
                    </p>
                    <div className="role-skill-row">
                      {insight.matchedSkills.slice(0, 3).map(skill => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                    <strong>Why this fits you</strong>
                    <small>{insight.explanation}</small>
                    <Link href="/discover">
                      Inspect role <ArrowUpRight size={14} />
                    </Link>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Your role map is waiting."
              message="Match your resume to turn the expanded job catalogue into a focused shortlist."
            />
          )}
        </section>
      </section>
    </AppShell>
  );
}

function Metric({
  icon,
  value,
  label,
  note,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  note: string;
}) {
  return (
    <article className="metric-cell">
      <span>{icon}</span>
      <strong>{value}</strong>
      <p>{label}</p>
      <small>{note}</small>
    </article>
  );
}

function BriefPulse({ value, label }: { value: number; label: string }) {
  return (
    <>
      <BarChart3 size={15} />
      <span>
        {value} {label}
      </span>
    </>
  );
}
