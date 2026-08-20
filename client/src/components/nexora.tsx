import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Command,
  MapPin,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import type {
  Job,
  JobSummary,
  MatchInsight,
  UserProfileDraft,
} from "../../../shared/nexora";
import { formatSalary, profileMatchPreview, relativeDate } from "@/lib/nexora";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { startLogin } from "@/const";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-mark" aria-label="NEXORA home">
      <span className="brand-orbit">
        <i />
        <i />
        <i />
      </span>
      {!compact && <span>NEXORA</span>}
    </Link>
  );
}

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/discover", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/applications", label: "Applications" },
  { href: "/profile", label: "Profile" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [location]);
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <BrandMark />{" "}
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={location === item.href ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="topbar-actions">
            <Link href="/discover" className="command-chip">
              <Command size={14} />
              <span>Search roles</span>
              <kbd>⌘ K</kbd>
            </Link>
            {location === "/" && (
              <Button className="home-signin" onClick={startLogin}>
                Sign in
              </Button>
            )}
            <Link
              href="/profile"
              className="avatar"
              aria-label="Open your profile"
            >
              AM
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav className="mobile-menu-panel" aria-label="Mobile navigation">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={location === item.href ? "active" : ""}
              >
                {item.label}
                <ChevronRight size={18} />
              </Link>
            ))}
            {location === "/" && (
              <Button className="mobile-home-signin" onClick={startLogin}>
                Sign in to NEXORA
              </Button>
            )}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {nav.map(item => {
          const Icon =
            item.label === "Dashboard"
              ? BarChart3
              : item.label === "Discover"
                ? Sparkles
                : item.label === "Saved"
                  ? Bookmark
                  : item.label === "Applications"
                    ? BriefcaseBusiness
                    : Building2;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={location === item.href ? "active" : ""}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function JobCard({
  job,
  profile,
  insight,
  matching,
  saved,
  onSave,
  onOpen,
}: {
  job: Job;
  profile: UserProfileDraft;
  insight?: MatchInsight;
  matching?: boolean;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  const fallback = profileMatchPreview(job, profile);
  const score = insight?.matchScore ?? fallback.score;
  const overlap = insight?.matchedSkills ?? fallback.overlap;
  return (
    <article className="job-card">
      <button
        className="job-card-main"
        onClick={onOpen}
        aria-label={`View ${job.title} at ${job.company}`}
      >
        <div className="job-card-head">
          <CompanyGlyph company={job.company} />
          <div className="job-card-title">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
          </div>
          {job.featured && <span className="featured-dot">Curated</span>}
        </div>
        <div className="job-metadata">
          <span>
            <MapPin size={14} />
            {job.location}
          </span>
          <span>
            <BriefcaseBusiness size={14} />
            {labelize(job.jobType)}
          </span>
          <span>
            <Clock3 size={14} />
            {labelize(job.experienceLevel)}
          </span>
        </div>
        <p className="salary-line">{formatSalary(job)}</p>
        <div className="skill-row">
          {job.skills.slice(0, 4).map(skill => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </button>
      <div className="job-card-footer">
        <div className="fit-preview">
          <span className="score-orb">{score}%</span>
          <span>
            <strong>Why this fits you</strong>
            <small>
              {matching && !insight
                ? "Generating your insight…"
                : overlap.length
                  ? `${overlap.slice(0, 2).join(" · ")} align`
                  : "Explore your potential fit"}
            </small>
          </span>
        </div>
        <div className="card-actions">
          <button
            className={saved ? "save-button saved" : "save-button"}
            onClick={onSave}
            aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
          <button className="view-link" onClick={onOpen}>
            View <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function JobSkeleton() {
  return (
    <div className="job-card skeleton-card">
      <div className="skeleton-line wide" />
      <div className="skeleton-line mid" />
      <div className="skeleton-line" />
      <div className="skeleton-chips" />
      <div className="skeleton-line" />
    </div>
  );
}

export function CompanyGlyph({ company }: { company: string }) {
  const letters = company
    .split(" ")
    .map(word => word[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="company-glyph" aria-hidden="true">
      {letters}
    </span>
  );
}

export function DetailsPanel({
  job,
  profile,
  saved,
  onSave,
  onClose,
  onTrack,
  onMatch,
  match,
  matching,
  onSummary,
  summary,
  summarizing,
}: {
  job: Job | null;
  profile: UserProfileDraft;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
  onTrack: () => void;
  onMatch: () => void;
  match: MatchInsight | null;
  matching: boolean;
  onSummary: () => void;
  summary: JobSummary | null;
  summarizing: boolean;
}) {
  if (!job) return null;
  const fallback = profileMatchPreview(job, profile);
  return (
    <aside
      className="detail-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div className="detail-top">
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close role details"
        >
          <X size={19} />
        </button>
        <span>{job.source}</span>
      </div>
      <div className="detail-company">
        <CompanyGlyph company={job.company} />
        <div>
          <h2 id="detail-title">{job.title}</h2>
          <p>{job.company}</p>
        </div>
      </div>
      <div className="job-metadata detail-metadata">
        <span>
          <MapPin size={14} />
          {job.location}
        </span>
        <span>
          <BriefcaseBusiness size={14} />
          {labelize(job.jobType)}
        </span>
        <span>
          <Clock3 size={14} />
          {labelize(job.experienceLevel)}
        </span>
      </div>
      <div className="detail-actions">
        <Button onClick={onSave} variant="outline">
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save role"}
        </Button>
        <Button onClick={onTrack}>
          <BriefcaseBusiness size={16} />
          Track application
        </Button>
      </div>
      <section className="detail-section match-section">
        <div className="section-kicker">
          <Sparkles size={15} />
          AI-estimated match
        </div>
        <div className="match-heading">
          <strong>{match?.matchScore ?? fallback.score}%</strong>
          <span>
            {matching
              ? "Analyzing your profile…"
              : (match?.source ?? "Profile-based")}
          </span>
        </div>
        <div className="meter">
          <i style={{ width: `${match?.matchScore ?? fallback.score}%` }} />
        </div>
        <h3>Why this fits you</h3>
        <p>
          {match?.explanation ??
            (fallback.overlap.length
              ? `${fallback.overlap.join(", ")} appear in this role’s core skill set. Analyze the full fit for a grounded, real-time explanation.`
              : "This is an early signal based on your stated preferences. Analyze the full fit for a grounded, real-time explanation.")}
        </p>
        <Button size="sm" variant="ghost" onClick={onMatch} disabled={matching}>
          <Sparkles size={15} />
          {matching ? "Analyzing this role…" : "Analyze your fit"}
        </Button>
      </section>
      <section className="detail-section">
        <div className="section-title-row">
          <h3>Role brief</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onSummary}
            disabled={summarizing}
          >
            <Sparkles size={15} />
            {summarizing ? "Summarizing…" : "Summarize this job"}
          </Button>
        </div>
        {summary ? (
          <div className="summary-block">
            <p>{summary.summary}</p>
            <h4>What they’re looking for</h4>
            <ul>
              {summary.requirements.map(item => (
                <li key={item}>
                  <Check size={14} />
                  {item}
                </li>
              ))}
            </ul>
            <small>{summary.source}</small>
          </div>
        ) : (
          <p>{job.description}</p>
        )}
      </section>
      <section className="detail-section">
        <h3>Skill signals</h3>
        <div className="skill-row">
          {job.skills.map(skill => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>
      {job.applyUrl.includes("example.com") ? (
        <Link className="apply-link" href={`/apply/${job.id}`}>
          Apply on company website <ArrowRight size={16} />
        </Link>
      ) : (
        <a className="apply-link" href={job.applyUrl} target="_blank" rel="noreferrer">
          Apply on company website <ArrowRight size={16} />
        </a>
      )}
    </aside>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-symbol">✦</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="error-state">
      <CircleAlert size={22} />
      <div>
        <strong>We couldn’t load roles right now.</strong>
        <p>Please try again. Your saved opportunities are still safe.</p>
      </div>
      <Button variant="outline" size="sm" onClick={retry}>
        Retry
      </Button>
    </div>
  );
}

export function labelize(value: string) {
  return value === "full-time"
    ? "Full-time"
    : value === "part-time"
      ? "Part-time"
      : value === "onsite"
        ? "On-site"
        : value.charAt(0).toUpperCase() + value.slice(1);
}
