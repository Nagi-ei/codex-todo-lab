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

## Slice 3 (Auth Feature Boundary)

- Goal: auth type and server helper를 `src/features/auth`로 이동해 route entry를 얇게 유지한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - `/auth` route entry는 public action entrypoint로만 남기고 인증 orchestration은 feature service로 이동한다.
  - auth domain 타입은 route 폴더가 아니라 feature layer에 둔다.
  - 기존 `/auth` 및 `/auth/check-email` 흐름과 UI 상호작용은 유지한다.
- Verify:
  - `bun run test:e2e:smoke --grep auth`
  - `bun run lint`

## TDD Cycle (Slice 3)

- RED: `src/app/auth/actions.ts`와 `src/app/auth/types.ts`가 auth domain logic과 계약 타입을 route 폴더 안에 유지하고 있어서 scaffold의 route-entry 규칙을 위반하고 있었다.
- GREEN: auth 타입을 `src/features/auth/types/auth.ts`로 옮기고, 로그인/회원가입 orchestration을 `src/features/auth/services/auth-actions.ts`로 추출한 뒤 route action entry는 thin wrapper로 변경했다.
- REFACTOR: auth error toast의 타입 참조를 feature 경계로 맞추고 route 폴더의 legacy type file을 제거했다.

## Verification Result (Slice 3)

- `rg -n "app/auth/types" src tests` => no matches
- `bun run test:e2e:smoke --grep auth` => pass (3 tests)
- `bun run lint` => pass

## Slice 4 (Final Verification And Closure)

- Goal: branch-wide verification을 완료하고 남은 구조 리스크를 명시한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - route entry와 feature/service 경계가 이번 브랜치 범위 내에서 일관된지 다시 확인한다.
  - 최종 verify 실패 시 가장 이른 관련 slice로 되돌아간다.
  - 이번 브랜치에서 의도적으로 남긴 read-path 구조 이슈는 follow-up risk로만 기록하고 즉석 확장은 하지 않는다.
- Verify:
  - `bun run verify`

## TDD Cycle (Slice 4)

- RED: full-project verification이 없으면 helper move, action decomposition, auth boundary split이 실제 앱 플로우를 깨뜨리지 않았다는 증거가 부족했다.
- GREEN: `bun run verify`를 실행해 typecheck, lint, unit, smoke e2e를 한 번에 통과시켰다.
- REFACTOR: handoff를 현재 상태와 잔여 리스크 중심으로 정리하고, 문서 브랜치에서 다룰 후속 작업과 구조적 잔여 이슈를 분리해 기록했다.

## Verification Result (Slice 4)

- `bun run verify` => pass
  - `bun run typecheck` => pass
  - `bun run lint` => pass
  - `bun run test:unit` => pass (6 files, 26 tests)
  - `bun run test:e2e:smoke` => pass (4 tests)

## Replan (Cycle 2)

- Date: `2026-03-08`
- Trigger:
  - review found that `src/app/todos/page.tsx` still owns todo read orchestration even after cycle 1 refactors.
- Review finding summary:
  - route entry still creates the Supabase client, builds the todo query, branches on filter values, and fetches rows directly.
  - this is acceptable enough to ship functionally, but it is the main remaining boundary inconsistency against `frontend-architecture-rules`.
- Replan decision:
  - reopen branch 05 for a second cycle focused only on extracting the todo read path from the route entry.
  - keep all other branch-05 changes closed unless the new extraction exposes a regression.

## Slice 5 (Todo Read Path Extraction)

- Goal: `/todos` route entry에서 todo read orchestration을 제거한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - `src/app/todos/page.tsx`는 searchParams 해석, redirect, rendering composition만 담당한다.
  - Supabase client setup, query construction, row fetching은 `src/features/todos/services`로 이동한다.
  - 기존 filter/read error/todos smoke 동작은 유지한다.
- Verify:
  - `bun run test:e2e:smoke --grep todos`
  - `bun run typecheck`

## TDD Cycle (Slice 5)

- RED: review finding대로 `src/app/todos/page.tsx`가 Supabase client 생성, query 구성, filter 분기, row fetching을 직접 들고 있었다.
- GREEN: `readTodosForPage`를 `src/features/todos/services/todo-read.ts`로 추출하고 page는 read result만 소비하도록 변경했다.
- REFACTOR: read error mapping과 row mapping 재사용을 feature service 안으로 모아 route file import surface를 줄였다.

## Verification Result (Slice 5)

- `bun run test:e2e:smoke --grep todos` => pass (1 test)
- `bun run typecheck` => pass

## Slice 6 (Cycle 2 Final Verification)

- Goal: cycle 2 branch-wide verification을 완료하고 재오픈된 finding 해소 상태를 고정한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - `/todos` route entry가 read orchestration 대신 route composition에 머무는지 다시 확인한다.
  - final verify 실패 시 cycle 2는 Slice 5로 되돌아간다.
  - cycle 2에서는 추가 범위 확장 없이 기존 finding 해소 여부만 확정한다.
- Verify:
  - `bun run verify`

## TDD Cycle (Slice 6)

- RED: cycle 2 변경 후 full-project verification이 없으면 read-path extraction이 auth/todo 전체 흐름에 안전한지 확정할 수 없었다.
- GREEN: `bun run verify`를 다시 실행해 typecheck, lint, unit, smoke e2e를 모두 통과시켰다.
- REFACTOR: handoff를 cycle 2 완료 상태 기준으로 정리하고, branch 06이 이어받을 문서 작업과 구조 리스크를 분리해 기록했다.

## Verification Result (Slice 6)

- `bun run verify` => pass
  - `bun run typecheck` => pass
  - `bun run lint` => pass
  - `bun run test:unit` => pass (6 files, 26 tests)
  - `bun run test:e2e:smoke` => pass (4 tests)
