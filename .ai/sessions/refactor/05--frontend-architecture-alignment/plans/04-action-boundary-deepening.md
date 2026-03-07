# Branch Plan

- Primary classification: `next-app-router`
- Secondary classification: `react-ui`
- Primary skill lens: `frontend-architecture-rules`
- Secondary skill lens: `next-best-practices`, `vercel-react-best-practices`

## Meta

- Session Name: `refactor/05--frontend-architecture-alignment`
- Git Branch: `codex/refactor/05--frontend-architecture-alignment`
- Date: `2026-03-08`
- Owner: `Codex`
- Current Cycle: `04-action-boundary-deepening`
- Plan Snapshot: `plans/04-action-boundary-deepening.md`

## Scope

- In:
  - move todo action result/types out of `src/app/todos`
  - move logout and remaining auth action entrypoints into the auth feature boundary
  - deepen todo mutation separation from `action -> service -> repository`
  - preserve current auth/todo behavior and verification coverage
- Out:
  - route redesign
  - new product behavior
  - branch 06 documentation execution
  - unrelated UI refactors

## Interface / Type Changes

- No user-facing route, query param, or mutation result contract changes are planned.
- Existing UI imports may move from `src/features/todos/actions/*` and `src/features/auth/actions/*`, but exported action names stay stable.
- Todo action result/type contracts move out of `src/app/todos/action-types.ts` into feature-local type files.

## Slice 10

- Goal: shared action contract와 auth/logout 위치를 올바른 feature boundary로 정렬한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - `src/app/todos/action-types.ts` is removed from the route layer.
  - logout action is owned by the auth feature rather than the todo feature.
  - auth mutation action entrypoints also follow the feature-local action policy.
- Out of scope:
  - deep todo mutation internals
  - read-path changes already completed in cycle 2
- Planned files:
  - `src/features/todos/types/*`
  - `src/features/auth/actions/*`
  - `src/features/todos/actions/*`
  - `src/app/auth/actions.ts` and any remaining route-level action files
  - related component imports
- RED:
  - current structure still leaves action contracts in `app` and places logout under the wrong feature.
- GREEN:
  - relocate shared action contracts and auth-owned actions into their feature boundaries.
- REFACTOR:
  - remove route-level action files that become forwarding-only after the move.
- Verify:
  - `bun run test:e2e:smoke --grep auth`
  - `bun run typecheck`
- Failure recovery:
  - if auth/logout relocation changes navigation or session behavior, stop and isolate that regression before touching todo internals.
- Commit:
  - `♻️ refactor: align action contracts and auth action ownership`

## Slice 11

- Goal: todo mutation path를 `action -> service -> repository`로 더 깊게 분리한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - feature-local action files remain thin server boundaries.
  - use-case/service files no longer mix persistence details directly with action entry semantics.
  - Supabase write/read persistence is isolated behind repository-style functions or equivalent persistence modules.
  - naming reflects actual responsibility at each layer.
- Out of scope:
  - auth parity beyond Slice 10
  - route-level read restructuring already complete
- Planned files:
  - `src/features/todos/actions/*`
  - `src/features/todos/services/*`
  - `src/features/todos/repositories/*` or equivalent persistence layer
  - `tests/unit/todos/actions-*.test.ts`
- RED:
  - current todo mutation functions still combine action-oriented concerns with direct Supabase persistence in the same module.
- GREEN:
  - extract persistence details into a repository layer and keep service functions focused on use-case orchestration.
- REFACTOR:
  - normalize names so action/service/repository responsibilities are obvious from imports alone.
- Verify:
  - `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts`
  - `bun run typecheck`
- Failure recovery:
  - if deeper separation changes mutation behavior, stop and fix at the smallest boundary before continuing.
- Commit:
  - `♻️ refactor: separate todo mutation services from persistence`

## Slice 12

- Goal: cycle 4 closure와 branch-wide verification을 완료한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - cycle 4 artifacts capture the final action-boundary outcome.
  - full-project verification passes after the structural changes.
  - remaining follow-up is limited to branch 06 docs alignment or optional future parity cleanups.
- Out of scope:
  - unrelated cleanup
  - branch 06 docs execution
- Planned files:
  - `.ai/sessions/refactor/05--frontend-architecture-alignment/log.md`
  - `.ai/sessions/refactor/05--frontend-architecture-alignment/handoff.md`
- RED:
  - until full verification re-runs, cycle 4 cannot prove the deeper action separation is safe.
- GREEN:
  - run final verify and record cycle-4 closure notes.
- REFACTOR:
  - keep handoff focused on the resulting canonical structure and next branch boundary.
- Verify:
  - `bun run verify`
- Failure recovery:
  - if final verify fails, return to the earliest affected slice.
- Commit:
  - `🧹 chore: finalize branch 05 cycle 4 verification`

## Final Stages

- Hardening:
  - confirm action-level auth, feature ownership, and persistence boundaries remain explicit after the deeper split.
- Review:
  - check that no route-layer action artifacts remain and that action/service/repository responsibilities are discernible.
- Refactor:
  - apply only fixes justified by cycle-4 verification or review findings.
- Final Verify:
  - `bun run verify`
