# Branch Plan

- Primary classification: `next-app-router`
- Secondary classification: `react-ui`
- Primary skill lens: `frontend-architecture-rules`
- Secondary skill lens: `next-best-practices`

## Meta

- Session Name: `refactor/05--frontend-architecture-alignment`
- Git Branch: `codex/refactor/05--frontend-architecture-alignment`
- Date: `2026-03-08`
- Owner: `Codex`
- Current Cycle: `02-todo-read-path-extraction`
- Plan Snapshot: `plans/02-todo-read-path-extraction.md`

## Scope

- In:
  - extract todo read orchestration from `src/app/todos/page.tsx` into `src/features/todos/services`
  - keep `/todos` page focused on route entry composition, auth gate, and rendering
  - preserve current filter behavior, read error mapping, and smoke-test coverage
  - re-run full verification after the read-path refactor
- Out:
  - mutation contract changes
  - auth flow changes
  - new product behavior
  - branch 06 documentation rewrite

## Interface / Type Changes

- No user-facing route, action, or UI contract changes are planned.
- Existing `/todos` query parameter contract remains:
  - `filter=all|active|completed`
- Existing public route/action entrypoints remain stable.

## Slice 5

- Goal: todo read orchestration을 feature service로 이동해 `/todos` page를 route composition으로 정리한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - `src/app/todos/page.tsx` no longer owns Supabase client creation, query construction, or row fetching.
  - todo read orchestration lives under `src/features/todos/services`.
  - filter parsing, row mapping, and read error rendering continue to behave as before.
- Out of scope:
  - mutation refactors already completed in cycle 1
  - auth route changes already completed in cycle 1
- Planned files:
  - `src/app/todos/page.tsx`
  - `src/features/todos/services/*`
  - `tests/e2e/todos.smoke.spec.ts`
  - `tests/unit/todos/*` when needed for new read-path helpers
- RED:
  - capture the current route-level read coupling via the review finding and add or adjust coverage if the extracted helper introduces a new public boundary worth testing directly.
- GREEN:
  - move read orchestration into feature-layer services and keep the page file focused on route entry composition.
- REFACTOR:
  - remove duplicated query-selection details from the route file and keep feature service naming explicit about read behavior.
- Verify:
  - `bun run test:e2e:smoke --grep todos`
  - `bun run typecheck`
- Failure recovery:
  - if extraction changes read behavior or broadens route/client boundaries, stop and replan before mixing behavioral fixes with structure cleanup.
- Commit:
  - `♻️ refactor: extract todo read path from route entry`

## Slice 6

- Goal: second-cycle closure와 branch-wide verification을 완료한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - cycle 2 changes are recorded in session artifacts.
  - final verify passes after the read-path extraction.
  - remaining risks are explicit and limited to acceptable route-level composition or future docs alignment.
- Out of scope:
  - unrelated cleanup
  - branch 06 docs work
- Planned files:
  - `.ai/sessions/refactor/05--frontend-architecture-alignment/log.md`
  - `.ai/sessions/refactor/05--frontend-architecture-alignment/handoff.md`
- RED:
  - until full verification re-runs, the second cycle cannot prove the review finding was fixed safely.
- GREEN:
  - execute final verify and capture cycle-2 closure notes.
- REFACTOR:
  - trim handoff and residual risks to only current branch state.
- Verify:
  - `bun run verify`
- Failure recovery:
  - if final verify fails, return to Slice 5 instead of patching only the symptom.
- Commit:
  - `🧹 chore: finalize branch 05 cycle 2 verification`

## Final Stages

- Hardening:
  - re-check route-entry purity for `/todos`, especially auth gate versus domain read orchestration boundaries.
- Review:
  - confirm the previous finding on `src/app/todos/page.tsx` is resolved and no new boundary regressions were introduced.
- Refactor:
  - apply only fixes justified by cycle-2 verification or review findings.
- Final Verify:
  - `bun run verify`
