# Codex Todo Lab

Codex Todo Lab is a small Next.js App Router project used to practice Codex workflows through a simple Todo app.

This repository focuses on:

- Codex-driven planning, execution, verification, and replan flow
- branch-based development with explicit session artifacts
- email-based auth and user-scoped Todo CRUD with Supabase
- feature-local Server Actions and UI mutation hooks
- repeatable verification with unit tests and smoke E2E

## Screenshot
<img width="1688" height="1256" alt="image" src="https://github.com/user-attachments/assets/a2ea5243-5ea3-450a-b6df-c7a76d2ca786" />

## Stack

- Next.js App Router
- React + TypeScript
- Bun
- Supabase
- TanStack Query
- Zod
- shadcn/ui + Tailwind CSS
- Vitest
- Playwright

## Requirements

- Bun installed
- A Supabase project
- Local environment variables configured

## Environment Variables

Create `.env.local` with the values used by this app:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
SUPABASE_SECRET_KEY=...
SUPABASE_AUTO_CONFIRM_EMAILS=false
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` are required by the app.
- `SUPABASE_SECRET_KEY` is server-only and is used for admin-only helpers or validation flows.
- `SUPABASE_AUTO_CONFIRM_EMAILS=true` is useful for local testing and is enabled automatically by the Playwright web server.

## Install

```bash
bun install
```

## Run Locally

Start the app:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

Full project verification:

```bash
bun run verify
```

Individual commands:

```bash
bun run typecheck
bun run lint
bun run test:unit
bun run test:e2e:smoke
```

Playwright smoke tests run the app on port `3001` through the configured `webServer` in [playwright.config.ts](/Users/nagi/Downloads/codex-test/playwright.config.ts).

## Routes

- `/`: simple entry page
- `/auth`: login and signup
- `/auth/check-email`: post-signup guidance
- `/todos`: protected Todo page
- `/todos?filter=all|active|completed`: filtered Todo view

Unauthenticated users are redirected from `/todos` to `/auth`.

## Architecture

This repository follows the rules in [AGENTS.md](/Users/nagi/Downloads/codex-test/AGENTS.md) and [SCAFFOLD_STRUCTURE.md](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md).

Current architectural rules:

- `src/app` contains route entry files only.
- Reads are handled in Server Components or feature services used by Server Components.
- Writes use feature-local Server Actions under `src/features/<domain>/actions`.
- UI-side mutation orchestration lives in feature hooks under `src/features/<domain>/hooks`.
- Shared SDK setup and global utilities stay in `src/lib`.

## Project Structure

```text
src/
  app/
    auth/
    todos/
  features/
    auth/
      actions/
      services/
      types/
    todos/
      actions/
      hooks/
      presentation/
      schema/
      services/
      types/
  components/
    auth/
    todos/
    ui/
    providers/
  lib/
    supabase/
```

High-level ownership:

- `src/app/todos/page.tsx` resolves search params, redirects unauthenticated users, and renders the page composition.
- `src/features/todos/services/todo-read.ts` owns the Todo read path for the page.
- `src/features/todos/actions/*` own Todo mutation boundaries.
- `src/features/todos/hooks/*` own client-side mutation orchestration such as `useMutation`, refresh, and feedback handling.
- `src/features/auth/actions/*` own auth mutations such as login, signup, and logout.

## Database and Supabase Notes

- The Todo table migration lives in `supabase/migrations/`.
- The Supabase runbook lives in [supabase/README.md](/Users/nagi/Downloads/codex-test/supabase/README.md).
- CLI-first migration application is the default workflow.
- RLS validation for user isolation was documented as an operational validation branch before this docs branch.

## Tests

Unit tests cover the Todo domain contracts and behavior:

- schema validation
- filter parsing
- presentation mapping
- read-error handling
- action create/update/toggle/delete behavior

Smoke E2E covers:

- auth flow
- protected route access
- Todo create/filter/toggle/delete flow

## Related Docs

- Product requirements: [docs/PRD.md](/Users/nagi/Downloads/codex-test/docs/PRD.md)
- Master plan: [docs/MASTER-PLAN.md](/Users/nagi/Downloads/codex-test/docs/MASTER-PLAN.md)
- Branch plan: [docs/BRANCH-DEVELOPMENT-PLAN.md](/Users/nagi/Downloads/codex-test/docs/BRANCH-DEVELOPMENT-PLAN.md)
- Scaffold rules: [SCAFFOLD_STRUCTURE.md](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md)
- Learning notes: [docs/LEARNING-NOTES.md](/Users/nagi/Downloads/codex-test/docs/LEARNING-NOTES.md)

## Re-entry Checklist

If you are returning to this repository after a break:

1. Read [docs/MASTER-PLAN.md](/Users/nagi/Downloads/codex-test/docs/MASTER-PLAN.md).
2. Read [docs/BRANCH-DEVELOPMENT-PLAN.md](/Users/nagi/Downloads/codex-test/docs/BRANCH-DEVELOPMENT-PLAN.md).
3. Read [SCAFFOLD_STRUCTURE.md](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md).
4. Read [docs/LEARNING-NOTES.md](/Users/nagi/Downloads/codex-test/docs/LEARNING-NOTES.md).
5. Run `bun run verify` before changing behavior.
