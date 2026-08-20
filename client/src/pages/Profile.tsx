import { Check, MapPin, Pencil, Sparkles } from "lucide-react";
import { useState } from "react";
import type { UserProfileDraft } from "../../../shared/nexora";
import { AppShell } from "@/components/nexora";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCareerProfile } from "@/hooks/useCareerProfile";

export default function Profile() {
  const [career, setCareer] = useCareerProfile();
  const profile = career.profile;
  const updateProfile = (next: UserProfileDraft) =>
    setCareer(current => ({ ...current, profile: next }));
  const [editing, setEditing] = useState(false);
  const [skillText, setSkillText] = useState(profile.skills.join(", "));
  const [roleText, setRoleText] = useState(profile.preferredRoles.join(", "));
  const [preferredLocationText, setPreferredLocationText] = useState(
    profile.preferredLocations.join(", ")
  );
  const toList = (value: string) =>
    value
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  const save = () => {
    updateProfile({
      ...profile,
      skills: toList(skillText),
      preferredRoles: toList(roleText),
      preferredLocations: toList(preferredLocationText),
    });
    setEditing(false);
  };
  return (
    <AppShell>
      <div className="page-wrap profile-page">
        <div className="profile-hero">
          <div className="profile-avatar">
            {profile.name
              .split(" ")
              .map(part => part[0])
              .join("")}
          </div>
          <div>
            <div className="eyebrow">
              <Sparkles size={14} />
              Profile signal
            </div>
            <h1>{profile.name}</h1>
            <p>
              <MapPin size={15} />
              {profile.location} · {profile.experienceLevel} level
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              if (!editing) {
                setSkillText(profile.skills.join(", "));
                setRoleText(profile.preferredRoles.join(", "));
                setPreferredLocationText(profile.preferredLocations.join(", "));
              }
              setEditing(!editing);
            }}
          >
            <Pencil size={15} />
            {editing ? "Cancel" : "Edit profile"}
          </Button>
        </div>
        <div className="profile-grid">
          <section className="profile-card profile-identity">
            <div className="card-label">Career preferences</div>
            {editing ? (
              <div className="form-stack">
                <label>
                  Name
                  <input
                    value={profile.name}
                    onChange={event =>
                      updateProfile({ ...profile, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Location
                  <input
                    value={profile.location}
                    onChange={event =>
                      updateProfile({
                        ...profile,
                        location: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Experience
                  <select
                    value={profile.experienceLevel}
                    onChange={event =>
                      updateProfile({
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
                <label>
                  Work preference
                  <select
                    value={profile.workMode}
                    onChange={event =>
                      updateProfile({
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
                <label>
                  Preferred roles, separated by commas
                  <input
                    value={roleText}
                    onChange={event => setRoleText(event.target.value)}
                    placeholder="Product Designer, UX Researcher"
                  />
                </label>
                <label>
                  Preferred locations, separated by commas
                  <input
                    value={preferredLocationText}
                    onChange={event =>
                      setPreferredLocationText(event.target.value)
                    }
                    placeholder="Remote, Bengaluru"
                  />
                </label>
                <Button onClick={save}>
                  <Check size={16} />
                  Save profile
                </Button>
              </div>
            ) : (
              <div className="preference-list">
                <p>
                  <span>Experience</span>
                  <strong>{profile.experienceLevel} level</strong>
                </p>
                <p>
                  <span>Preferred work</span>
                  <strong>
                    {profile.workMode === "any" ? "Flexible" : profile.workMode}
                  </strong>
                </p>
                <p>
                  <span>Target roles</span>
                  <strong>{profile.preferredRoles.join(", ")}</strong>
                </p>
                <p>
                  <span>Locations</span>
                  <strong>{profile.preferredLocations.join(", ")}</strong>
                </p>
              </div>
            )}
          </section>
          <section className="profile-card skills-card">
            <div className="section-title-row">
              <div>
                <div className="card-label">Your strengths</div>
                <h2>Skills that shape your match</h2>
              </div>
              <span className="skill-count">{profile.skills.length}</span>
            </div>
            {editing ? (
              <label className="skills-input">
                Skills, separated by commas
                <textarea
                  value={skillText}
                  onChange={event => setSkillText(event.target.value)}
                />
              </label>
            ) : (
              <div className="skill-row large">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
            <div className="profile-note">
              <Sparkles size={17} />
              <p>
                NEXORA uses these details only to explain relevance and offer
                AI-estimated job-match insights.
              </p>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
