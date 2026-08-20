import { ArrowRight, Check, FileText, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { UserProfileDraft } from "../../../shared/nexora";
import { getCareerProfileCompletionIssues } from "../../../shared/careerProfile";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandMark } from "@/components/nexora";
import { Button } from "@/components/ui/button";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { toast } from "sonner";

const toList = (value: string) =>
  value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [career, setCareer] = useCareerProfile();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfileDraft>(career.profile);
  const [resumeText, setResumeText] = useState(career.resumeText);
  const [skills, setSkills] = useState(career.profile.skills.join(", "));
  const [roles, setRoles] = useState(career.profile.preferredRoles.join(", "));

  useEffect(() => {
    if (!profile.name && user?.name) {
      setProfile(current => ({ ...current, name: user.name ?? "" }));
    }
  }, [profile.name, user?.name]);

  if (loading || !isAuthenticated) {
    return (
      <div className="onboarding-loading">Preparing your NEXORA space…</div>
    );
  }

  const draft = {
    profile: {
      ...profile,
      skills: toList(skills),
      preferredRoles: toList(roles),
      preferredLocations: profile.location ? [profile.location] : [],
    },
    resumeText,
    onboardingComplete: true,
  };

  const continueToResume = () => {
    if (
      !profile.name.trim() ||
      !profile.location.trim() ||
      !toList(roles).length
    ) {
      toast.error("Add your name, location, and at least one target role.");
      return;
    }
    setStep(2);
  };

  const finish = () => {
    const completionIssues = getCareerProfileCompletionIssues(draft);
    if (completionIssues.length) {
      toast.error(completionIssues.join(" "));
      return;
    }
    setCareer(draft);
    toast.success("Your career signal is ready.");
    navigate("/dashboard");
  };

  return (
    <main className="onboarding-page">
      <section className="onboarding-shell">
        <aside className="onboarding-aside">
          <BrandMark />
          <div>
            <p className="onboarding-eyebrow">YOUR CAREER SIGNAL</p>
            <h1>
              Make your next move
              <em> intentional.</em>
            </h1>
            <p>
              One focused setup gives NEXORA the context to find roles that fit.
              You can edit every detail later from your profile.
            </p>
          </div>
          <div className="onboarding-signal-card" aria-hidden="true">
            <span>ROLE SIGNAL</span>
            <strong>{step === 1 ? "01" : "02"}</strong>
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
        </aside>

        <section className="onboarding-form-panel">
          <div className="onboarding-progress" aria-label={`Step ${step} of 2`}>
            <span className={step >= 1 ? "active" : ""}>01 Direction</span>
            <i />
            <span className={step >= 2 ? "active" : ""}>02 Resume</span>
          </div>
          {step === 1 ? (
            <div className="onboarding-form">
              <div className="onboarding-heading">
                <span>
                  <MapPin size={16} /> START WITH DIRECTION
                </span>
                <h2>A few details, once.</h2>
                <p>These preferences power every match across NEXORA.</p>
              </div>
              <label>
                Your name
                <input
                  value={profile.name}
                  onChange={event =>
                    setProfile({ ...profile, name: event.target.value })
                  }
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <div className="onboarding-two-col">
                <label>
                  Your location
                  <input
                    value={profile.location}
                    onChange={event =>
                      setProfile({ ...profile, location: event.target.value })
                    }
                    placeholder="Hyderabad, India"
                    autoComplete="address-level2"
                  />
                </label>
                <label>
                  Experience level
                  <select
                    value={profile.experienceLevel}
                    onChange={event =>
                      setProfile({
                        ...profile,
                        experienceLevel: event.target
                          .value as UserProfileDraft["experienceLevel"],
                      })
                    }
                  >
                    <option value="intern">Intern</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </label>
              </div>
              <label>
                Target roles
                <input
                  value={roles}
                  onChange={event => setRoles(event.target.value)}
                  placeholder="Product Designer, Software Engineer"
                />
              </label>
              <label>
                Work preference
                <select
                  value={profile.workMode}
                  onChange={event =>
                    setProfile({
                      ...profile,
                      workMode: event.target
                        .value as UserProfileDraft["workMode"],
                    })
                  }
                >
                  <option value="any">Flexible</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </label>
              <Button className="violet-button" onClick={continueToResume}>
                Continue to resume <ArrowRight size={16} />
              </Button>
            </div>
          ) : (
            <div className="onboarding-form">
              <div className="onboarding-heading">
                <span>
                  <FileText size={16} /> ADD YOUR EVIDENCE
                </span>
                <h2>Bring your resume once.</h2>
                <p>
                  NEXORA extracts stated skills to explain your strongest role
                  matches.
                </p>
              </div>
              <label>
                Core skills
                <input
                  value={skills}
                  onChange={event => setSkills(event.target.value)}
                  placeholder="React, TypeScript, SQL, Figma"
                  aria-describedby="skills-hint"
                />
                <span id="skills-hint" className="onboarding-field-hint">
                  Separate skills with commas. Your skills are used across your
                  profile and role matches.
                </span>
              </label>
              <label>
                Resume text
                <textarea
                  value={resumeText}
                  onChange={event => setResumeText(event.target.value)}
                  placeholder="Paste your resume, projects, experience, and skills here."
                  rows={11}
                />
                <span className="onboarding-field-hint" aria-live="polite">
                  {resumeText.trim().length < 40
                    ? `${40 - resumeText.trim().length} more characters needed.`
                    : "Resume detail is ready."}
                </span>
              </label>
              <div className="onboarding-actions">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="violet-button" onClick={finish}>
                  <Check size={16} /> Build my role map
                </Button>
              </div>
              <p className="onboarding-privacy">
                <Sparkles size={15} /> Your details are used only for your
                NEXORA profile and transparent role matching.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
