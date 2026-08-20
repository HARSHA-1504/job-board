import type {
  CareerProfileRecord,
  UserProfileDraft,
} from "../../../shared/nexora";
import { useNexoraStorage } from "./useNexoraStorage";

const blankProfile: UserProfileDraft = {
  name: "",
  location: "",
  experienceLevel: "entry",
  skills: [],
  preferredRoles: [],
  preferredLocations: [],
  workMode: "any",
};

const initialCareerProfile: CareerProfileRecord = {
  profile: blankProfile,
  resumeText: "",
  onboardingComplete: false,
};

function legacyCareerProfile(): CareerProfileRecord {
  try {
    const legacy = window.localStorage.getItem("nexora.profile.v1");
    if (!legacy) return initialCareerProfile;
    const profile = JSON.parse(legacy) as UserProfileDraft;
    return { profile, resumeText: "", onboardingComplete: false };
  } catch {
    return initialCareerProfile;
  }
}

export function useCareerProfile() {
  return useNexoraStorage<CareerProfileRecord>(
    "nexora.career.v1",
    legacyCareerProfile()
  );
}
