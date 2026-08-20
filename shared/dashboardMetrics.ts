export function calculateCareerMomentum(input: {
  savedCount: number;
  applicationCount: number;
  interviewingCount: number;
}) {
  const { savedCount, applicationCount, interviewingCount } = input;
  return Math.min(
    100,
    24 + savedCount * 8 + applicationCount * 12 + interviewingCount * 8
  );
}
