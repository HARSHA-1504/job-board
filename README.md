# NEXORA

**NEXORA** is an AI-assisted job discovery and application-tracking experience designed around context rather than keyword overload. It provides a public-facing landing page, natural-language job discovery, transparent job-match explanations, a personal career profile, saved roles, and an application pipeline.

## Product capabilities

| Capability                 | Implementation                                                                                                                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Natural-language discovery | A typed search-intent procedure interprets role, skills, location, salary, work style, seniority, and employment type. The interface renders the resulting intent as editable discovery context.                                                                                                              |
| Job discovery              | A normalized job model powers filterable, sortable cards that show company, location, role metadata, salary, skills, and a profile-aware match cue.                                                                                                                                                           |
| AI insights                | The application uses the configured server-side LLM integration for search parsing, the exact **Why this fits you** explanation, resume-to-role matching, and job summarization. Profile-based and resume-derived deterministic fallback logic keeps the experience useful if the AI provider is unavailable. |
| Career command center      | A dashboard combines opportunity momentum, role metrics, application trajectory, a layered 3D signal visualisation, and a resume workspace that produces an explainable shortlist.                                                                                                                            |
| Career profile             | Visitors can maintain skills, experience level, target roles, locations, and work-mode preference. Profile information is used only to explain relevance in the demo.                                                                                                                                         |
| Opportunity management     | Saved roles are kept in browser storage for a frictionless demo. The application tracker supports the exact statuses **Applied**, **Interviewing**, **Offered**, and **Rejected**, with notes and timestamps.                                                                                                 |
| Demo data resilience       | Twenty-nine diverse, normalized demo roles are seeded incrementally into the database when available. The same curated data remains available through an in-memory fallback, so local development never depends on an external job-board credential.                                                          |

## Local development

| Command        | Purpose                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm install` | Install project dependencies.                                                                     |
| `pnpm dev`     | Start the full-stack development server. The application is available at `http://localhost:3000`. |
| `pnpm lint`    | Verify Prettier formatting.                                                                       |
| `pnpm check`   | Run TypeScript without emitting files.                                                            |
| `pnpm test`    | Run the Vitest suite.                                                                             |
| `pnpm build`   | Create the production client and server build in `dist/`.                                         |

## Environment configuration

The managed project runtime automatically supplies the database, authentication, and server-side AI gateway variables. For a copied project, start from `.env.example` and keep credentials out of version control.

| Variable                 | Required for                    | Notes                                                                   |
| ------------------------ | ------------------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`           | Persistent job records          | A MySQL/TiDB-compatible connection string.                              |
| `BUILT_IN_FORGE_API_URL` | LLM-powered search and insights | Server-side gateway endpoint.                                           |
| `BUILT_IN_FORGE_API_KEY` | LLM-powered search and insights | Server-side gateway credential; never expose this value in client code. |
| `JWT_SECRET`             | Auth sessions                   | Required by the included auth infrastructure.                           |

## Architecture

The React 19 client uses Wouter for routing, Tailwind CSS for the visual system, and typed tRPC procedures for all server calls. `shared/nexora.ts` defines the cross-layer contracts. The server separates mock provider data, repository behavior, and LLM/fallback service logic, while the database schema contains the normalized `jobs` table. The UI stores profile, saved-role, and tracker state locally for the completed single-user demo workflow. The dashboard uses layered CSS transforms and reduced-motion-safe styles rather than requiring a graphics runtime.

## Verification

The repository includes a GitHub Actions workflow at `.github/workflows/verify.yml`. It runs formatting checks, unit tests, the TypeScript checker, and the production build on pushes and pull requests.

> **Demo-data notice:** The job records are fictional seeded product data created to demonstrate the application. They are not live vacancies, and external application links intentionally point to a safe example domain.
