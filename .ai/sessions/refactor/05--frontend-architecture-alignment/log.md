# Session Log

## Planner

- Date: `2026-03-08`
- Session Name: `refactor/05--frontend-architecture-alignment`
- Git Branch: `codex/refactor/05--frontend-architecture-alignment`
- Primary classification: `next-app-router`
- Secondary classification: `react-ui`
- Primary skill lens: `frontend-architecture-rules`
- Secondary skill lens: `next-best-practices`
- Replan reason:
  - branch 05 was changed from documentation cleanup to code and structure refactoring, and branch 06 now owns the follow-up docs alignment work.
- Current baseline findings:
  - `src/app/todos/actions.ts` is 390 lines and currently mixes validation, auth context lookup, Supabase persistence, result shaping, and logout behavior.
  - `src/app/todos/page.tsx` still owns todo row mapping and filter/read helper imports from `src/app/todos` instead of a feature domain.
  - `src/app/auth/actions.ts` and `src/app/auth/types.ts` keep auth-domain logic inside route folders.
  - current scaffold does not yet contain `src/features/todos` or `src/features/auth`, so the branch needs a staged move instead of incremental file drift.
- Planned stop conditions:
  - a refactor requires changing an existing public action contract
  - route files cannot remain thin without mixing unrelated concerns into hooks or `src/lib`
  - verification exposes a behavior regression in auth or todo smoke paths

## Slice Baseline

- Slice 1:
  - focus: move todo helper modules to `src/features/todos`
  - bind: `frontend-architecture-rules`
- Slice 2:
  - focus: split todo server actions by responsibility
  - bind: `frontend-architecture-rules`
- Slice 3:
  - focus: move auth types and action helpers to `src/features/auth`
  - bind: `frontend-architecture-rules`
- Slice 4:
  - focus: full verification and branch closure artifacts
  - bind: `frontend-architecture-rules`

## Slice 1 (Todo Helper Relocation)

- Goal: todo support modules를 `src/features/todos`로 이동하고 route entry 책임만 남긴다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - route entry인 `src/app/todos/page.tsx`에는 orchestration만 남긴다.
  - schema/type/presentation helper는 `src/features/todos`로 이동한다.
  - 기존 공개 진입점(`createTodoAction`, `TodoCreateForm`, `TodosPage`)의 동작은 바꾸지 않는다.
- Verify:
  - `bun run test:unit -- tests/unit/todos/schema.test.ts tests/unit/todos/filter.test.ts tests/unit/todos/presentation.test.ts tests/unit/todos/read-error.test.ts`

## TDD Cycle (Slice 1)

- RED: todo helper unit tests와 route/component imports가 모두 `src/app/todos/*`에 묶여 있어서 scaffold 기준의 feature 경계를 만족하지 못했다.
- GREEN: `schema`, `types`, `filter`, `read-error`, `presentation` helper를 `src/features/todos`로 이동하고 route/components/tests import를 새 경계로 갱신했다.
- REFACTOR: `src/app/todos/page.tsx`에서 row mapping을 제거하고 feature presentation의 `mapTodo`를 사용하도록 정리했으며 legacy helper 파일을 삭제했다.

## Verification Result (Slice 1)

- `rg -n "app/todos/(filter|presentation|read-error|schema|types)" src tests` => no matches
- `bun run test:unit -- tests/unit/todos/schema.test.ts tests/unit/todos/filter.test.ts tests/unit/todos/presentation.test.ts tests/unit/todos/read-error.test.ts` => pass (4 files, 15 tests)

## Slice 2 (Todo Action Decomposition)

- Goal: `src/app/todos/actions.ts`를 thin entry로 줄이고 feature service로 책임을 분리한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - `use server` entry는 route layer에 유지하고 validation/context/persistence/result shaping은 feature service로 이동한다.
  - action public interface(`createTodoAction`, `updateTodoAction`, `toggleTodoAction`, `deleteTodoAction`)는 유지한다.
  - 도메인 로직을 `src/lib`나 client hook으로 우회시키지 않는다.
- Verify:
  - `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts`
  - `bun run typecheck`

## TDD Cycle (Slice 2)

- RED: 현재 action tests는 public entrypoints를 기준으로 하고 있지만, 실제 구현은 `src/app/todos/actions.ts` 한 파일에 validation, auth context, persistence, error shaping이 섞여 있었다.
- GREEN: action context, error/result helpers, CRUD/toggle persistence orchestration을 `src/features/todos/services/*`로 이동하고 `src/app/todos/actions.ts`는 thin wrapper로 축소했다.
- REFACTOR: `createRequestId`, `toErrorResult`, `toTitleFieldErrorKeys`를 공통 service helper로 추출해 create/update/toggle/delete 흐름 중복을 줄였다.

## Verification Result (Slice 2)

- `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts` => pass (2 files, 11 tests)
- `bun run typecheck` => pass
