import type { CareerProfileRecord } from "./nexora";

export const CAREER_RESUME_MIN_LENGTH = 40;

export function getCareerProfileCompletionIssues(record: CareerProfileRecord) {
  const { profile, resumeText } = record;
  const issues: string[] = [];

  if (!profile.name.trim()) issues.push("Add your name.");
  if (!profile.location.trim()) issues.push("Add your location.");
  if (!profile.preferredRoles.length)
    issues.push("Add at least one target role.");
  if (!profile.skills.length) {
    issues.push("Add at least one core skill, separated with commas.");
  }

  const remainingCharacters =
    CAREER_RESUME_MIN_LENGTH - resumeText.trim().length;
  if (remainingCharacters > 0) {
    issues.push(
      `Add ${remainingCharacters} more resume character${remainingCharacters === 1 ? "" : "s"} to reach the ${CAREER_RESUME_MIN_LENGTH}-character minimum.`
    );
  }

  return issues;
}

export function isCareerProfileReady(record: CareerProfileRecord) {
  return getCareerProfileCompletionIssues(record).length === 0;
}
