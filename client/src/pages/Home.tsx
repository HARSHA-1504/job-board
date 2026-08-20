import { ArrowRight, Check, Compass, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AppShell, BrandMark } from "@/components/nexora";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { isCareerProfileReady } from "../../../shared/careerProfile";
import { DEMO_JOBS } from "../../../shared/demoJobs";
import { getPostSignInRoute } from "../../../shared/onboarding";

const homeInk = { color: "#ffffff" } as const;
const homeMuted = { color: "#e6e1f7" } as const;
const homeAccent = { color: "#d2c6ff" } as const;

const suggestions = [
  "Python fresher jobs in Hyderabad",
  "Remote React roles with TypeScript",
  "Data analyst jobs in Bengaluru",
  "AI/ML internships",
];

export default function Home() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const { isAuthenticated, loading } = useAuth();
  const [career] = useCareerProfile();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(
        getPostSignInRoute(
          isAuthenticated,
          career.onboardingComplete && isCareerProfileReady(career)
        )
      );
    }
  }, [career, isAuthenticated, loading, navigate]);

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const value = query.trim();
    if (value) navigate(`/discover?q=${encodeURIComponent(value)}`);
  };

  return (
    <AppShell>
      <section className="editorial-hero">
        <div className="editorial-copy">
          <div className="editorial-kicker">
            <Sparkles size={13} /> Career intelligence for deliberate moves
          </div>
          <h1 className="editorial-title" style={homeInk}>
            BUILD YOUR
            <span style={homeAccent}>NEXT MOVE.</span>
          </h1>
          <p className="editorial-description" style={homeMuted}>
            Find roles that work with your skills, ambitions, and next chapter.
            Less noise. More signal.
          </p>
          <div className="editorial-actions">
            <Button className="lime-button" onClick={startLogin}>
              Sign in to match <ArrowRight size={16} />
            </Button>
            <Button
              variant="outline"
              className="outline-button"
              onClick={() => navigate("/discover")}
            >
              Explore roles
            </Button>
          </div>
          <div className="editorial-facts" aria-label="NEXORA benefits">
            <span>AI role matching</span>
            <span>{DEMO_JOBS.length} curated roles</span>
            <span>Clear application tracking</span>
          </div>
        </div>

        <div className="career-product-visual" aria-hidden="true">
          <div className="visual-annotation annotation-top">
            YOUR NEXT CHAPTER
          </div>
          <div className="visual-tape">
            NEXORA / CAREER SIGNAL / NEXORA / CAREER SIGNAL
          </div>
          <div className="career-card-back">
            <span>ROLE RADAR</span>
            <div className="radar-arcs">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="career-card-front">
            <span className="mini-label">MATCHED OPPORTUNITY</span>
            <strong>
              94<span>%</span>
            </strong>
            <div className="role-bars">
              <i />
              <i />
              <i />
              <i />
            </div>
            <p>Signal strength: high</p>
          </div>
          <div className="career-orb">
            <span>AI</span>
          </div>
          <div className="visual-annotation annotation-bottom">
            INTENT / SKILLS / MOMENTUM
          </div>
        </div>
      </section>

      <section className="editorial-search-band">
        <div>
          <span className="section-number" style={homeAccent}>
            01
          </span>
          <h2 style={homeInk}>Tell us what you’re looking for.</h2>
        </div>
        <form className="editorial-search" onSubmit={submit}>
          <Compass size={19} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Try: junior Python roles in Hyderabad"
            aria-label="Natural language job search"
          />
          <button type="submit">Search</button>
        </form>
        <div className="editorial-suggestions">
          {suggestions.map(suggestion => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                navigate(`/discover?q=${encodeURIComponent(suggestion)}`);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      <section className="editorial-proof">
        <div className="proof-statement">
          <span className="section-number" style={homeAccent}>
            02
          </span>
          <h2 style={homeInk}>Job search, without the second-guessing.</h2>
        </div>
        <div className="proof-points">
          <article>
            <Check size={18} />
            <h3 style={homeInk}>Intent first</h3>
            <p style={homeMuted}>
              Your words become filters you can understand and adjust.
            </p>
          </article>
          <article>
            <Check size={18} />
            <h3 style={homeInk}>Fit, explained</h3>
            <p style={homeMuted}>
              Every role includes the exact reasons it meets your profile.
            </p>
          </article>
          <article>
            <Check size={18} />
            <h3 style={homeInk}>Momentum kept</h3>
            <p style={homeMuted}>
              Save promising roles and keep each application moving.
            </p>
          </article>
        </div>
        <div className="proof-cta">
          <BrandMark compact />
          <p style={homeInk}>Make your next move intentional.</p>
          <Button
            className="lime-button"
            onClick={() => navigate("/dashboard")}
          >
            Open career dashboard <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
