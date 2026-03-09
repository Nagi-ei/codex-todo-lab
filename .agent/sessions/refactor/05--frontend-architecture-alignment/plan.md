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
- Current Cycle: `05-action-directness-and-ui-hooks`
- Plan Snapshot: `plans/05-action-directness-and-ui-hooks.md`

## Scope

- In:
  - remove thin todo action wrappers and make feature-local Server Actions the real mutation boundary
  - extract todo UI mutation hooks so todo components keep rendering and local UI state only
  - remove the todo repository layer if it does not provide a meaningful persistence contract
  - preserve current auth/todo behavior and verification coverage
- Out:
  - route redesign
  - new product behavior
  - branch 06 documentation execution
  - unrelated UI refactors

## Interface / Type Changes

- No user-facing route, query param, or mutation result contract changes are planned.
- Existing UI imports may move from direct `useMutation` wiring in components to feature-local todo hooks, but action result contracts stay stable.

## Decision Summary

- Keep:
  - `src/features/todos/actions/*` as the canonical server mutation boundary.
  - shared server helpers that still provide real value, such as auth context lookup and standardized action result shaping.
  - current todo action result contract and current route behavior.
- Remove:
  - forwarding-only todo action wrappers.
  - `src/features/todos/services/todo-mutations.ts` if action files absorb the real mutation execution.
  - `src/features/todos/repositories/todo-repository.ts` if it remains only a query-chain wrapper.
- Add:
  - feature-local todo mutation hooks for create, update, toggle, and delete.
  - an explicit target structure that keeps server mutation logic out of UI component files.

## Target Structure

```text
src/features/todos/
  actions/
    create-todo.ts
    update-todo.ts
    toggle-todo.ts
    delete-todo.ts
  hooks/
    use-create-todo-mutation.ts
    use-update-todo-mutation.ts
    use-toggle-todo-mutation.ts
    use-delete-todo-mutation.ts
  services/
    action-context.ts
    action-result.ts
    todo-read.ts
  schema/
  types/
  presentation/
```

## Boundary Rules For Cycle 5

1. Server Action file는 더 이상 forwarding-only wrapper로 두지 않는다.
2. action file는 validation, auth, mutation execution, result shaping까지 담당할 수 있다.
3. service file는 shared helper나 read-path orchestration처럼 action 간에 실질적으로 공유되는 책임만 남긴다.
4. component file는 `useMutation` 설정, toast orchestration, `router.refresh()` 결정을 직접 들지 않는다.
5. UI mutation lifecycle은 `src/features/todos/hooks/*`로 이동한다.
6. repository abstraction은 persistence contract를 독립적으로 설명할 수 있을 때만 유지한다.
7. 이번 cycle에서는 auth domain parity까지 확장하지 않는다.

## Slice 13

- Goal: scaffold policy를 thin-wrapper action에서 direct Server Action 기준으로 재정렬한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - route entry only 원칙은 유지한다.
  - direct Server Action 허용이 곧 route-level action 복귀를 뜻하지 않는다는 점을 문서에 명시한다.
  - UI hooks와 server actions의 책임을 서로 겹치지 않게 정의한다.
- Done criteria:
  - `SCAFFOLD_STRUCTURE.md` no longer requires forwarding-only Server Action wrappers.
  - policy clearly separates route entry, Server Action boundary, UI mutation hook boundary.
  - the updated wording still keeps `src/app` route-entry only.
- Out of scope:
  - todo CRUD behavior changes
  - auth action relocation that was already completed
- Planned files:
  - `SCAFFOLD_STRUCTURE.md`
- RED:
  - current scaffold wording pushes actions toward thin wrappers even when that wrapper adds no architectural value.
- GREEN:
  - update the Server Action policy so action files can own validation, auth, and mutation execution when no meaningful extra use-case layer exists.
- REFACTOR:
  - align placement rules and checklist wording with the new direct-action stance.
- Verify:
  - `rg -n "thin|wrapper|Server Action Policy|hooks" SCAFFOLD_STRUCTURE.md`
- Failure recovery:
  - if the policy wording becomes ambiguous about action/service boundaries, stop and simplify it before code changes.
- Commit:
  - `📝 docs: replan todo action and hook boundaries`

## Slice 14

- Goal: todo mutation path를 direct Server Action + UI mutation hook 구조로 재정렬한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - action file imports alone should make the server write path readable.
  - hook file imports alone should make the UI mutation orchestration readable.
  - component files should retain only rendering and local UI state.
- Done criteria:
  - todo Server Actions are no longer forwarding-only wrappers.
  - todo components no longer define `useMutation` inline.
  - repository/service layers that do not add a real boundary are removed.
  - action and hook names reflect the actual UI/server boundary responsibilities.
- Out of scope:
  - auth form mutation cleanup
  - todo read-path work already completed in cycle 2
- Planned files:
  - `src/features/todos/actions/*`
  - `src/features/todos/hooks/*`
  - `src/features/todos/services/*`
  - `src/features/todos/repositories/*`
  - `src/components/todos/*`
  - `tests/unit/todos/actions-*.test.ts`
- RED:
  - current todo components own `useMutation` wiring and current action files are only pass-through wrappers around service functions.
- GREEN:
  - move actual mutation execution into action files, extract UI-oriented mutation hooks, and remove the repository layer.
- REFACTOR:
  - keep only shared server helpers that still carry clear value, such as auth context or standardized error/result mapping.
- Verify:
  - `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts`
  - `bun run typecheck`
- Failure recovery:
  - if direct-action wiring changes mutation behavior, stop at the affected action or hook instead of spreading fixes across components.
- Commit:
  - `♻️ refactor: collapse todo wrappers into actions and hooks`

## Slice 15

- Goal: cycle 5 closure와 branch-wide verification을 완료한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - cycle 5 artifacts capture the direct-action and UI-hook outcome.
  - full-project verification passes after the structural changes.
  - remaining follow-up is limited to branch 06 docs alignment or optional future parity cleanups.
- Out of scope:
  - unrelated cleanup
  - branch 06 docs execution
- Planned files:
  - `.agent/sessions/refactor/05--frontend-architecture-alignment/log.md`
  - `.agent/sessions/refactor/05--frontend-architecture-alignment/handoff.md`
- RED:
  - until full verification re-runs, cycle 5 cannot prove the action/hook collapse is safe.
- GREEN:
  - run final verify and record cycle-5 closure notes.
- REFACTOR:
  - keep handoff focused on the resulting canonical structure and next branch boundary.
- Verify:
  - `bun run verify`
- Failure recovery:
  - if final verify fails, return to the earliest affected slice.
- Commit:
  - `🧹 chore: finalize branch 05 cycle 5 verification`

## Final Stages

- Hardening:
  - confirm direct Server Action boundaries and UI mutation hooks remain explicit after the collapse.
- Review:
  - check that no todo component owns server mutation orchestration and that action/hook boundaries are discernible.
- Refactor:
  - apply only fixes justified by cycle-5 verification or review findings.
- Final Verify:
  - `bun run verify`
