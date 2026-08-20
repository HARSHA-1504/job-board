export function getPostSignInRoute(
  isAuthenticated: boolean,
  isCareerProfileReady: boolean
) {
  if (!isAuthenticated) return "/";
  return isCareerProfileReady ? "/dashboard" : "/onboarding";
}
