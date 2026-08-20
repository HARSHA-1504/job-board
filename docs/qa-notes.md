# Visual QA Notes

The desktop landing page presents the intended asymmetric public-facing composition: an oversized left-aligned hero, natural-language search as the primary action, and a distinctive signal-visualization cluster on the right. The full-width discovery page was verified after the data request resolved; it renders all nine normalized demo roles with readable filters, skills, salary ranges, match cues, and the exact "Why this fits you" label.

The saved-jobs and application-tracker pages correctly display their intentional empty states on first use, and the profile page surfaces editable preferences and skill chips. The 375 px landing and discovery screens retain clear hierarchy, touch-sized controls, compact role cards, and the mobile bottom navigation. The local job-listing endpoint returned the expected normalized role data, and automated unit, format, type, and production-build verification passed.

The final desktop profile view retained its two-column hierarchy and visible preferred-role and preferred-location values. The discovery capture displayed its intentionally non-blocking loading skeleton while the data query was pending; a final delayed capture is required to confirm the enriched cards after the request settles.

The final discovery capture resolved nine job cards and displayed the exact **Why this fits you** label with profile-aware score cues across the feed. The experience now keeps its immediate profile-based signal visible while the background AI batch request refines the explanation, avoiding an indefinite loading state.

The enhanced dashboard was verified at desktop size. It renders a high-contrast NEXORA command center with layered orbital 3D depth, role-count metrics, a resume-to-role matching console, application trajectory, and an intentional empty state before a resume is analysed. The expanded discovery feed now resolves 29 normalized roles. The interface retains visible focusable actions and reduced-motion safeguards for its non-essential perspective effects.

The dashboard was also verified at a 390 px mobile viewport. Its command hero, opportunity metrics, resume input, trajectory panel, and role-map empty state stack cleanly, while the responsive navigation remains accessible at the top of the screen.

Final local verification passed after the expanded data and dashboard-metric tests were added: formatting, TypeScript, nine Vitest assertions, and the production build all completed successfully. A direct local call to the resume-matching procedure returned an explainable, resume-derived shortlist led by the Frontend Engineer role for a supplied React and TypeScript resume.

The reported mobile discovery error was traced to a 29-item automatic insight request exceeding the server's twelve-role batch limit. Discovery now requests refinement only for the first twelve visible roles and leaves every card's immediate profile-based signal available. The corrected twelve-role procedure returned HTTP 200 with twelve insights, and a mobile discovery preview showed the 29-role feed without the prior error indicator.

The reference-inspired redesign was visually checked on the landing page, discovery view, and career dashboard. The landing page now applies an off-white canvas, black editorial display typography, a lime primary action system, compact navigation with a visible Sign in control, and an original career-signal composition. The product workflows retain the same light canvas and use lime as the primary signal treatment, preserving functionality while removing the former dark visual language.

The final 390 px mobile check confirmed the light editorial homepage keeps its full visual hierarchy: the secure Sign in to match call-to-action, concise feature proof, original career-signal card, natural-language search, and career-dashboard link are all visible and touch-friendly. The dashboard stacks its headline, lime role-signal action, metrics, resume matcher, and application trajectory into a readable mobile sequence.

The final dark onboarding validation confirms that an authenticated incomplete record is routed from the homepage into the one-time Direction and Resume setup, while the shared post-sign-in route helper is covered for unauthenticated, incomplete, and complete outcomes. The dark onboarding panel remains readable and actionable at 390 px, with only the single profile-and-resume record used across the product.

The onboarding completion check now treats comma-separated core skills as valid input and provides separate, actionable reasons for an incomplete record. A short resume no longer produces a generic skills error: the form identifies exactly how many more characters are required to reach the 40-character resume minimum. The focused test suite now includes this populated-skills, short-resume case.
