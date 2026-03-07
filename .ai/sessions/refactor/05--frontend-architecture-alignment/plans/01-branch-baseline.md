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
- Current Cycle: `01-branch-baseline`
- Plan Snapshot: `plans/01-branch-baseline.md`

## Scope

- In:
  - move todo domain types, schema, presentation helpers, and read helpers out of `src/app/todos`
  - reduce `src/app/todos/page.tsx` to route orchestration and server-read composition only
  - split `src/app/todos/actions.ts` into smaller domain-aligned modules while preserving Server Action entrypoints
  - move auth action helpers/types into `src/features/auth` so route files stay entry-focused
  - keep existing behavior and tests green while aligning placement to `SCAFFOLD_STRUCTURE.md`
- Out:
  - product feature changes
  - visual redesign
  - new state library or backend architecture changes
  - branch 06 documentation rewrite beyond minimal references required by moved code

## Interface / Type Changes

- No user-facing flow changes are planned.
- Existing public action names stay stable:
  - `loginMutationAction`
  - `signupMutationAction`
  - `createTodoAction`
  - `updateTodoAction`
  - `toggleTodoAction`
  - `deleteTodoAction`
  - `logoutAction`
- Internal imports are expected to move from `src/app/*` into `src/features/auth/*` and `src/features/todos/*`.

## Slice 1

- Goal: todo domain supporting code를 `src/features/todos`로 이동해 route 파일 책임을 줄인다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - `src/app/todos/page.tsx` no longer owns domain type mapping, filter parsing helpers, or presentation helpers that belong to the todo domain.
  - todo schema, types, filter parsing, read error mapping, and presentation helpers live under `src/features/todos` roles that match `SCAFFOLD_STRUCTURE.md`.
  - existing unit tests for todo schema/filter/presentation/read-error still pass with the new import boundaries.
- Out of scope:
  - mutation internals
  - auth route changes
- Planned files:
  - `src/app/todos/page.tsx`
  - `src/features/todos/schema/*`
  - `src/features/todos/types/*`
  - `src/features/todos/presentation/*`
  - `tests/unit/todos/*.test.ts`
- RED:
  - add or update unit coverage so imports exercise todo helpers through their new `src/features/todos` boundaries and fail until the modules are relocated.
- GREEN:
  - move the todo helper modules and update route/test imports with no behavior change.
- REFACTOR:
  - trim duplicate local helper code from `page.tsx` and keep route-level code focused on orchestration.
- Verify:
  - `bun run test:unit -- tests/unit/todos/schema.test.ts tests/unit/todos/filter.test.ts tests/unit/todos/presentation.test.ts tests/unit/todos/read-error.test.ts`
- Failure recovery:
  - if helper moves force route-level behavior changes, stop and replan before mixing placement cleanup with functional changes.
- Commit:
  - `♻️ refactor: move todo support modules into features`

## Slice 2

- Goal: todo mutation 코드를 작은 service/action 단위로 분리해 `src/app/todos/actions.ts` 비대화를 해소한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - `src/app/todos/actions.ts` becomes a thin Server Action entry module or explicit route-level wrapper.
  - validation, error mapping, row mapping, and Supabase persistence orchestration move to `src/features/todos/services`, `schema`, `types`, or `presentation` as appropriate.
  - action behavior remains compatible with current unit coverage for create/update/toggle/delete flows.
- Out of scope:
  - changing action result contracts
  - introducing route handlers
- Planned files:
  - `src/app/todos/actions.ts`
  - `src/app/todos/action-types.ts`
  - `src/features/todos/services/*`
  - `src/features/todos/types/*`
  - `tests/unit/todos/actions-create-update.test.ts`
  - `tests/unit/todos/actions-toggle-delete.test.ts`
- RED:
  - update action tests to import and verify the stable Server Action entrypoints after the planned module split, exposing any hidden coupling to the current monolith file.
- GREEN:
  - extract action context, request/error helpers, and persistence steps into feature-layer modules while preserving entrypoint signatures.
- REFACTOR:
  - remove duplication across create/update/toggle/delete paths and keep `use server` boundaries narrow and explicit.
- Verify:
  - `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts`
  - `bun run typecheck`
- Failure recovery:
  - if extraction requires contract changes, reopen Planner and document the new interface before proceeding.
- Commit:
  - `♻️ refactor: split todo server actions by responsibility`

## Slice 3

- Goal: auth route boundary를 정리해 route entry와 auth domain logic를 분리한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - auth types and server-side helpers move out of `src/app/auth` into `src/features/auth`.
  - route files under `src/app/auth` stay focused on entry composition.
  - auth UI and action flows keep their current behavior.
- Out of scope:
  - auth UX changes
  - new providers or session model changes
- Planned files:
  - `src/app/auth/actions.ts`
  - `src/app/auth/types.ts`
  - `src/app/auth/page.tsx`
  - `src/features/auth/services/*`
  - `src/features/auth/types/*`
  - `tests/e2e/auth.smoke.spec.ts`
- RED:
  - identify and codify the currently implicit auth boundary by running the smoke path and confirming route entrypoints remain the public interface.
- GREEN:
  - relocate auth domain code into feature-layer modules and update imports without changing auth flow behavior.
- REFACTOR:
  - simplify route-level imports and keep page/action modules thin.
- Verify:
  - `bun run test:e2e:smoke --grep @smoke --grep auth`
  - `bun run lint`
- Failure recovery:
  - if moved auth code impacts navigation or Supabase session behavior, stop and isolate the regression before any broader cleanup.
- Commit:
  - `♻️ refactor: separate auth feature logic from app routes`

## Slice 4

- Goal: branch closure에 필요한 전체 회귀와 아키텍처 검증을 완료한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - moved files follow `SCAFFOLD_STRUCTURE.md` without leaving duplicate legacy modules behind.
  - route files remain orchestration-focused and no component exceeds the project boundary expectations due to the refactor.
  - final verify passes and session artifacts capture any residual risks for branch 06 docs work.
- Out of scope:
  - broad documentation rewrite
  - unrelated style cleanups
- Planned files:
  - `.ai/sessions/refactor/05--frontend-architecture-alignment/log.md`
  - `.ai/sessions/refactor/05--frontend-architecture-alignment/handoff.md`
- RED:
  - until full-project verification runs, the refactor branch cannot prove behavioral safety.
- GREEN:
  - execute full verification and write closure notes tied to the architecture constraints.
- REFACTOR:
  - remove any remaining duplicate imports or dead files revealed by final verification.
- Verify:
  - `bun run verify`
- Failure recovery:
  - if final verify fails, return to the earliest affected slice instead of patching only the symptom.
- Commit:
  - `🧹 chore: finalize branch 05 verification and handoff`

## Final Stages

- Hardening:
  - re-check route-entry purity, Server Action boundaries, feature-layer placement, and regression risk around auth/todo flows.
- Review:
  - run `pr-review-check` with focus on mixed boundaries, oversized modules, and import-path regressions after file moves.
- Refactor:
  - apply only fixes justified by hardening or review findings.
- Final Verify:
  - `bun run verify`
