import {
  Filter,
  Loader2,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import type {
  Job,
  JobSummary,
  MatchInsight,
  SearchIntent,
} from "../../../shared/nexora";
import {
  AppShell,
  DetailsPanel,
  EmptyState,
  JobCard,
  JobSkeleton,
  labelize,
} from "@/components/nexora";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useNexoraStorage } from "@/hooks/useNexoraStorage";
import { type SavedJob } from "@/lib/nexora";
import { trpc } from "@/lib/trpc";
import { createApplication } from "../../../shared/applicationTracker";
import { DEMO_JOBS, filterDemoJobs } from "../../../shared/demoJobs";

type Filters = {
  location: string;
  workMode: "remote" | "hybrid" | "onsite" | "any";
  jobType: "full-time" | "part-time" | "contract" | "internship" | "any";
  seniority: "intern" | "entry" | "mid" | "senior" | "lead" | "any";
  salaryMin?: number;
  sort: "relevance" | "newest" | "salary";
};
const initialFilters: Filters = {
  location: "Anywhere",
  workMode: "any",
  jobType: "any",
  seniority: "any",
  sort: "relevance",
};

export default function Discover() {
  const [location] = useLocation();
  const [query, setQuery] = useState(
    () => new URLSearchParams(location.split("?")[1]).get("q") ?? ""
  );
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [intent, setIntent] = useState<SearchIntent | null>(null);
  const [openFilters, setOpenFilters] = useState(false);
  const [selected, setSelected] = useState<Job | null>(null);
  const [saved, setSaved] = useNexoraStorage<SavedJob[]>("nexora.saved.v1", []);
  const [career] = useCareerProfile();
  const profile = career.profile;
  const [match, setMatch] = useState<MatchInsight | null>(null);
  const [matchByJob, setMatchByJob] = useState<Record<string, MatchInsight>>(
    {}
  );
  const [summary, setSummary] = useState<JobSummary | null>(null);
  const searchInput = useMemo(
    () => ({
      query: query || undefined,
      ...filters,
      location: filters.location === "Anywhere" ? undefined : filters.location,
    }),
    [query, filters]
  );
  const localJobs = useMemo(
    () => filterDemoJobs(DEMO_JOBS, searchInput),
    [searchInput]
  );
  const jobsQuery = trpc.nexora.listJobs.useQuery(searchInput, {
    retry: 1,
    placeholderData: () => localJobs,
  });
  const jobs =
    jobsQuery.data && jobsQuery.data.length > 0 ? jobsQuery.data : localJobs;
  const parseSearch = trpc.nexora.interpretSearch.useMutation({
    onSuccess: data => {
      setIntent(data);
      setFilters(current => ({
        ...current,
        location:
          data.location === "Anywhere" ? current.location : data.location,
        workMode: data.workMode,
        jobType: data.workType,
        seniority: data.seniority,
        salaryMin: data.salaryMin ?? undefined,
      }));
    },
    onError: () =>
      toast.error(
        "We couldn’t interpret that search just now. You can still use the filters."
      ),
  });
  const matchJob = trpc.nexora.matchJob.useMutation({
    onSuccess: setMatch,
    onError: () =>
      toast.error(
        "AI match insight unavailable right now. The role details are still available."
      ),
  });
  const matchJobs = trpc.nexora.matchJobs.useMutation({
    onSuccess: results => {
      setMatchByJob(
        Object.fromEntries(
          results.map(result => [result.jobId, result.insight])
        )
      );
    },
  });
  const summarize = trpc.nexora.summarizeJob.useMutation({
    onSuccess: setSummary,
    onError: () =>
      toast.error(
        "AI summary unavailable right now. You can still view the full role description."
      ),
  });
  useEffect(() => {
    const prompted = new URLSearchParams(location.split("?")[1]).get("q");
    if (prompted && prompted !== query) {
      setQuery(prompted);
      parseSearch.mutate({ query: prompted });
    }
  }, [location]);
  const visibleJobIds = useMemo(
    () => jobs.map(job => job.id).join(","),
    [jobs]
  );
  useEffect(() => {
    if (!jobs.length || jobsQuery.isError) return;
    // The server refines up to twelve cards per request. Every card keeps its
    // immediate profile-based insight while this optional AI refinement runs.
    matchJobs.mutate({
      jobIds: jobs.slice(0, 12).map(job => job.id),
      profile,
    });
  }, [visibleJobIds, profile, jobsQuery.isError]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim().length < 3)
      return toast.message("Tell us a little more about the role you want.");
    parseSearch.mutate({ query });
  };
  const toggleSaved = (job: Job) => {
    const isSaved = saved.some(item => item.job.id === job.id);
    setSaved(
      isSaved
        ? saved.filter(item => item.job.id !== job.id)
        : [{ job, savedAt: new Date().toISOString() }, ...saved]
    );
    toast.success(
      isSaved
        ? "Removed from your opportunities"
        : "Saved to your opportunities"
    );
  };
  const selectJob = (job: Job) => {
    setSelected(job);
    setMatch(matchByJob[job.id] ?? null);
    setSummary(null);
  };
  const trackJob = () => {
    if (!selected) return;
    const applications = JSON.parse(
      window.localStorage.getItem("nexora.applications.v1") ?? "[]"
    ) as unknown[];
    if (
      !applications.some(
        item => (item as { job?: { id?: string } }).job?.id === selected.id
      )
    ) {
      window.localStorage.setItem(
        "nexora.applications.v1",
        JSON.stringify([
          createApplication(
            selected,
            new Date().toISOString(),
            crypto.randomUUID()
          ),
          ...applications,
        ])
      );
    }
    toast.success("Added to your application tracker");
  };
  const activeCount =
    Number(filters.location !== "Anywhere") +
    Number(filters.workMode !== "any") +
    Number(filters.jobType !== "any") +
    Number(filters.seniority !== "any") +
    Number(Boolean(filters.salaryMin));
  return (
    <AppShell>
      <div className="discover-wrap">
        <section className="discover-head">
          <div>
            <div className="eyebrow">
              <Sparkles size={14} />
              NEXORA discovery
            </div>
            <h1>
              Make your next move <em>intentional.</em>
            </h1>
          </div>
          <form className="discovery-search" onSubmit={submit}>
            <Search size={19} />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Try: junior Python roles in Hyderabad"
              aria-label="Search roles"
            />
            <Button type="submit" disabled={parseSearch.isPending}>
              {parseSearch.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Search"
              )}
            </Button>
          </form>
        </section>
        {parseSearch.isPending && (
          <div className="interpretation loading">
            <Loader2 className="animate-spin" size={17} />
            Understanding your search…
          </div>
        )}
        {intent && !parseSearch.isPending && (
          <section className="interpretation">
            <div>
              <span className="eyebrow muted">Understanding your search</span>
              <div className="intent-grid">
                <span>
                  <small>Role</small>
                  {intent.role}
                </span>
                <span>
                  <small>Seniority</small>
                  {labelize(intent.seniority)}
                </span>
                <span>
                  <small>Location</small>
                  {intent.location}
                </span>
                <span>
                  <small>Work style</small>
                  {intent.workMode === "any"
                    ? "Flexible"
                    : labelize(intent.workMode)}
                </span>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setIntent(null)}>
              <X size={15} />
              Edit preferences
            </Button>
          </section>
        )}
        <div className="results-layout">
          <aside className={openFilters ? "filters open" : "filters"}>
            <div className="filter-title">
              <span>
                <SlidersHorizontal size={16} />
                Refine signal
              </span>
              <button onClick={() => setFilters(initialFilters)}>Reset</button>
            </div>
            <FilterGroup
              title="Location"
              options={[
                "Anywhere",
                "Hyderabad",
                "Bengaluru",
                "Chennai",
                "Mumbai",
                "Delhi",
                "Pune",
                "Remote",
              ]}
              value={filters.location}
              onChange={value => setFilters({ ...filters, location: value })}
            />
            <FilterGroup
              title="Work mode"
              options={["any", "remote", "hybrid", "onsite"]}
              value={filters.workMode}
              onChange={value =>
                setFilters({
                  ...filters,
                  workMode: value as Filters["workMode"],
                })
              }
            />
            <FilterGroup
              title="Experience"
              options={["any", "intern", "entry", "mid", "senior", "lead"]}
              value={filters.seniority}
              onChange={value =>
                setFilters({
                  ...filters,
                  seniority: value as Filters["seniority"],
                })
              }
            />
            <FilterGroup
              title="Job type"
              options={[
                "any",
                "full-time",
                "part-time",
                "contract",
                "internship",
              ]}
              value={filters.jobType}
              onChange={value =>
                setFilters({ ...filters, jobType: value as Filters["jobType"] })
              }
            />
            <div className="filter-group">
              <h3>Minimum salary</h3>
              <select
                value={filters.salaryMin ?? ""}
                onChange={event =>
                  setFilters({
                    ...filters,
                    salaryMin: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  })
                }
              >
                <option value="">Any range</option>
                <option value="500000">₹5 LPA+</option>
                <option value="800000">₹8 LPA+</option>
                <option value="1200000">₹12 LPA+</option>
              </select>
            </div>
          </aside>
          <section className="results-area">
            <div className="results-toolbar">
              <div>
                <span className="eyebrow muted">Opportunity field</span>
                <h2>{jobs.length} roles in focus</h2>
              </div>
              <div>
                <Button
                  variant="outline"
                  className="filter-mobile"
                  onClick={() => setOpenFilters(!openFilters)}
                >
                  <Filter size={15} />
                  Filters {activeCount > 0 && <Badge>{activeCount}</Badge>}
                </Button>
                <select
                  value={filters.sort}
                  onChange={event =>
                    setFilters({
                      ...filters,
                      sort: event.target.value as Filters["sort"],
                    })
                  }
                  aria-label="Sort roles"
                >
                  <option value="relevance">Most relevant</option>
                  <option value="newest">Newest first</option>
                  <option value="salary">Highest salary</option>
                </select>
              </div>
            </div>
            {jobsQuery.isLoading && !jobs.length ? (
              <div className="job-list">
                {[1, 2, 3, 4].map(item => (
                  <JobSkeleton key={item} />
                ))}
              </div>
            ) : jobs.length ? (
              <div className="job-list">
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    profile={profile}
                    insight={matchByJob[job.id]}
                    matching={matchJobs.isPending}
                    saved={saved.some(item => item.job.id === job.id)}
                    onSave={() => toggleSaved(job)}
                    onOpen={() => selectJob(job)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No roles found"
                message="Try changing your search or removing some filters."
                action={
                  <Button
                    onClick={() => {
                      setQuery("");
                      setFilters(initialFilters);
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            )}
          </section>
        </div>
      </div>
      <DetailsPanel
        job={selected}
        profile={profile}
        saved={
          selected ? saved.some(item => item.job.id === selected.id) : false
        }
        onSave={() => selected && toggleSaved(selected)}
        onClose={() => setSelected(null)}
        onTrack={trackJob}
        onMatch={() =>
          selected && matchJob.mutate({ jobId: selected.id, profile })
        }
        match={match}
        matching={matchJob.isPending}
        onSummary={() => selected && summarize.mutate({ jobId: selected.id })}
        summary={summary}
        summarizing={summarize.isPending}
      />
    </AppShell>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      {options.map(option => (
        <label key={option}>
          <input
            type="radio"
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <span>{labelize(option)}</span>
        </label>
      ))}
    </div>
  );
}
