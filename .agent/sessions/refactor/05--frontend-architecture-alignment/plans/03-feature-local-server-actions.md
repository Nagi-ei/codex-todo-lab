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
- Current Cycle: `03-feature-local-server-actions`
- Plan Snapshot: `plans/03-feature-local-server-actions.md`

## Scope

- In:
  - write a repository-level action placement proposal based on current project constraints and Next/Vercel guidance
  - update `SCAFFOLD_STRUCTURE.md` so `src/app` remains route-entry only and feature-local server actions are explicitly supported
  - refactor todo mutation actions to the new feature-local server-action structure
  - preserve current auth/todo behavior and verification coverage
- Out:
  - broad feature redesign
  - route handler introduction
  - branch 06 documentation rewrite beyond references needed by the new structure
  - unrelated auth action relocation unless required by the new rule rollout

## Interface / Type Changes

- No user-facing route, query param, or mutation result contract changes are planned.
- Existing public mutation entrypoints stay stable from the UI call sites:
  - `createTodoAction`
  - `updateTodoAction`
  - `toggleTodoAction`
  - `deleteTodoAction`
- The file location of Server Actions is expected to move from `src/app/todos/actions.ts` to `src/features/todos/actions/*` or an equivalent feature-local action layer.

## Slice 7

- Goal: feature-local server action 정책을 문서 기준으로 명시한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - the repo documents clearly state that `src/app` is route-entry only.
  - `SCAFFOLD_STRUCTURE.md` names the feature-local action layer and its responsibility.
  - the policy records why this remains consistent with Next.js/Vercel guidance.
- Out of scope:
  - code refactor itself
  - mutation behavior changes
- Planned files:
  - `SCAFFOLD_STRUCTURE.md`
  - `.agent/sessions/refactor/05--frontend-architecture-alignment/log.md`
  - `.agent/sessions/refactor/05--frontend-architecture-alignment/handoff.md`
- RED:
  - current scaffold still allows route-level `actions.ts`, which conflicts with the desired “app contains routing only” rule.
- GREEN:
  - update the scaffold and session docs with an explicit feature-local server action policy and rationale.
- REFACTOR:
  - remove ambiguous wording so action placement is not split between route files and feature files.
- Verify:
  - `rg -n "actions|server action|route entry" SCAFFOLD_STRUCTURE.md`
- Failure recovery:
  - if the policy conflicts with binding project constraints, stop and replan before moving code.
- Commit:
  - `📝 docs: define feature-local server action policy`

## Slice 8

- Goal: todo mutation actions를 새 feature-local action layer로 옮기고 역할 이름을 정리한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - `src/app/todos` no longer holds mutation action entry files.
  - feature-local action files own `"use server"` boundaries, validation, auth checks, and use-case orchestration entry.
  - persistence-oriented helpers and action entrypoints use names that reflect their actual responsibility.
  - existing UI call sites and test coverage remain compatible.
- Out of scope:
  - todo read path changes already completed in cycle 2
  - auth action relocation unless needed for consistency after the todo rollout
- Planned files:
  - `src/features/todos/actions/*`
  - `src/features/todos/services/*`
  - `src/components/todos/*`
  - `tests/unit/todos/actions-*.test.ts`
- RED:
  - current `src/app/todos/actions.ts` is a thin wrapper layer that adds little value and keeps action placement inconsistent with the desired policy.
- GREEN:
  - move action entrypoints into a feature-local action layer and rename any persistence-heavy helpers to match their responsibility.
- REFACTOR:
  - trim forwarding-only wrappers and keep the feature action layer explicit about auth, validation, and persistence delegation.
- Verify:
  - `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts`
  - `bun run typecheck`
- Failure recovery:
  - if relocating actions breaks imports or security checks, stop and resolve at the feature boundary before broadening the refactor.
- Commit:
  - `♻️ refactor: move todo actions into feature layer`

## Slice 9

- Goal: cycle 3 closure와 branch-wide verification을 완료한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - cycle 3 artifacts capture the final policy and code outcome.
  - full-project verification passes after the todo action relocation.
  - remaining follow-up is limited to branch 06 docs alignment or optional auth parity work.
- Out of scope:
  - unrelated cleanup
  - branch 06 documentation execution
- Planned files:
  - `.agent/sessions/refactor/05--frontend-architecture-alignment/log.md`
  - `.agent/sessions/refactor/05--frontend-architecture-alignment/handoff.md`
- RED:
  - until full verification re-runs, cycle 3 cannot prove the new action structure is safe.
- GREEN:
  - run final verify and record cycle-3 closure notes.
- REFACTOR:
  - keep handoff focused on the resulting canonical structure and next branch boundary.
- Verify:
  - `bun run verify`
- Failure recovery:
  - if final verify fails, return to Slice 8.
- Commit:
  - `🧹 chore: finalize branch 05 cycle 3 verification`

## Final Stages

- Hardening:
  - confirm feature-local Server Actions still authenticate inside the action boundary and do not widen client/server exposure.
- Review:
  - check that action placement, naming, and route purity now align with the updated scaffold and Next.js guidance.
- Refactor:
  - apply only fixes justified by cycle-3 verification or review findings.
- Final Verify:
  - `bun run verify`
