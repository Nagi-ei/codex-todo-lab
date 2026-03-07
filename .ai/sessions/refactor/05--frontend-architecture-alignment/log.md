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

## Replan (Cycle 3)

- Date: `2026-03-08`
- Trigger:
  - follow-up design discussion found that route-level `actions.ts` wrappers keep `src/app` from being routing-only and blur the difference between Server Action entrypoints and persistence-oriented services.
- Best-practice summary:
  - `next-best-practices/data-patterns.md` recommends Server Components for reads and Server Actions for mutations, but does not require Server Actions to live under `app`.
  - `next-best-practices/file-conventions.md` defines route special files but does not make `actions.ts` a required route convention.
  - `vercel-react-best-practices/server-auth-actions` reinforces that auth must happen inside each Server Action regardless of file location.
- Replan decision:
  - open cycle 3 to formalize feature-local Server Actions in the scaffold, then move todo mutation actions to that structure.

## Slice 7 (Feature-Local Server Action Policy)

- Goal: Server Action 배치 정책을 repository scaffold에 명시한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - `src/app`는 route entry only를 유지한다.
  - Server Action은 feature 경계 안에 두되, action file과 service file 책임을 분리한다.
  - 정책 근거는 Next.js/Vercel guidance와 충돌하지 않아야 한다.
- Verify:
  - `rg -n "actions|Server Action Policy|route entry" SCAFFOLD_STRUCTURE.md`

## TDD Cycle (Slice 7)

- RED: current scaffold가 route-level `actions.ts`를 허용하고 있어서 `app`을 라우팅 전용으로 유지하려는 목표와 충돌했다.
- GREEN: `SCAFFOLD_STRUCTURE.md`를 갱신해 feature-local `actions/` layer, route-entry only `app`, action-vs-service 책임 분리를 명시했다.
- REFACTOR: placement rules, decision order, review checklist의 wording을 같은 정책 용어로 정렬했다.

## Verification Result (Slice 7)

- `rg -n "actions|Server Action Policy|route entry" SCAFFOLD_STRUCTURE.md` => pass

## Slice 8 (Todo Action Layer Relocation)

- Goal: todo mutation action entry를 feature-local action layer로 이동하고 naming을 역할 기준으로 정리한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - `use server` boundary는 `src/features/todos/actions/*`에 둔다.
  - action entry는 auth/validation/use-case entry만 담당한다.
  - persistence-oriented orchestration은 service 레이어에 남기되 이름이 mutation responsibility를 드러내야 한다.
- Verify:
  - `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts`
  - `bun run typecheck`

## TDD Cycle (Slice 8)

- RED: `src/app/todos/actions.ts`는 forwarding-only wrapper였고, current policy와 달리 route 폴더에 mutation entry를 두고 있었다.
- GREEN: todo action entry를 `src/features/todos/actions/*`로 옮기고, service file은 `todo-mutations.ts`로 rename하면서 exported function 이름도 mutation orchestration 의미에 맞게 정리했다.
- REFACTOR: component/test/page import를 feature-local action files로 직접 연결해 route-level wrapper를 제거했다.

## Verification Result (Slice 8)

- `rg -n "app/todos/actions|services/todo-actions" src tests` => no matches
- `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts` => pass (2 files, 11 tests)
- `bun run typecheck` => pass

## Slice 9 (Cycle 3 Final Verification)

- Goal: cycle 3 branch-wide verification을 완료하고 최종 구조를 고정한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - `src/app`는 route entry만 유지되고, feature-local Server Actions가 실제로 동작해야 한다.
  - action 내부 auth/validation 경계가 새 위치로 이동해도 유지돼야 한다.
  - cycle 3에서는 추가 범위 확장 없이 최종 검증과 handoff만 수행한다.
- Verify:
  - `bun run verify`

## TDD Cycle (Slice 9)

- RED: policy와 action relocation이 끝나도 full-project verification이 없으면 새로운 구조가 auth/todo 전체 플로우를 깨뜨리지 않았다는 보장이 없었다.
- GREEN: `bun run verify`를 실행해 typecheck, lint, unit, smoke e2e를 모두 통과시켰다.
- REFACTOR: handoff를 최종 구조 기준으로 정리하고, branch 06이 이어받을 문서 정렬 포인트만 남겼다.

## Verification Result (Slice 9)

- `bun run verify` => pass
  - `bun run typecheck` => pass
  - `bun run lint` => pass
  - `bun run test:unit` => pass (6 files, 26 tests)
  - `bun run test:e2e:smoke` => pass (4 tests)

## Replan (Cycle 4)

- Date: `2026-03-08`
- Trigger:
  - follow-up structure review found three unresolved issues after cycle 3: todo action types still live in `src/app`, logout is owned by the wrong feature, and todo mutation services still mix use-case orchestration with direct persistence.
- Context correction:
  - the earlier `src/app/todos/page.tsx` review finding was already resolved in cycle 2 and is not the reason cycle 4 is opening.
- Replan decision:
  - open cycle 4 to finish the action-boundary work by relocating shared contracts, fixing auth ownership, and deepening the mutation separation into `action -> service -> repository`.

## Slice 10 (Action Contracts And Auth Ownership)

- Goal: action contract와 auth/logout ownership을 올바른 feature boundary로 정렬한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - route layer에는 action contract와 auth mutation entry를 남기지 않는다.
  - logout은 auth feature가 소유한다.
  - UI call sites는 feature-local action file을 직접 참조한다.
- Verify:
  - `bun run test:e2e:smoke --grep auth`
  - `bun run typecheck`

## TDD Cycle (Slice 10)

- RED: `src/app/todos/action-types.ts`, `src/app/auth/actions.ts`, `src/features/todos/actions/logout.ts`가 각각 잘못된 layer 또는 잘못된 feature ownership에 남아 있었다.
- GREEN: todo action contract를 `src/features/todos/types/todo-action.ts`로 옮기고, auth action entry와 logout을 `src/features/auth/actions/*`로 재배치했다.
- REFACTOR: component/page/presentation/service import를 새 feature 경계로 정리하고 legacy route/action files를 제거했다.

## Verification Result (Slice 10)

- `rg -n "app/todos/action-types|app/auth/actions|features/todos/actions/logout" src tests` => no matches
- `bun run test:e2e:smoke --grep auth` => pass (3 tests)
- `bun run typecheck` => pass

## Slice 11 (Todo Mutation Service And Repository Split)

- Goal: todo mutation path를 실제로 `action -> service -> repository`로 분리한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - feature-local action files는 thin server entry로 유지한다.
  - service는 validation, auth boundary, use-case orchestration에 집중한다.
  - Supabase I/O는 repository layer로 격리한다.
- Verify:
  - `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts`
  - `bun run typecheck`

## TDD Cycle (Slice 11)

- RED: `src/features/todos/services/todo-mutations.ts`가 validation, auth context, Supabase write/read 체인, result shaping을 한 파일에 모두 들고 있어서 service와 persistence 책임이 섞여 있었다.
- GREEN: `src/features/todos/repositories/todo-repository.ts`를 추가해 insert/update/find/delete Supabase access를 분리하고, `todo-mutations.ts`는 validation/auth/use-case orchestration과 action result shaping만 남기도록 정리했다.
- REFACTOR: repository 함수 이름을 `insertTodoForUser`, `updateTodoForUser`, `findTodoForUser`, `deleteTodoForUser`로 맞춰 persistence responsibility가 import 수준에서도 드러나게 했다.

## Verification Result (Slice 11)

- `bun run test:unit -- tests/unit/todos/actions-create-update.test.ts tests/unit/todos/actions-toggle-delete.test.ts` => pass (2 files, 11 tests)
- `bun run typecheck` => pass

## Slice 12 (Cycle 4 Final Verification)

- Goal: cycle 4 closure와 branch-wide verification을 완료한다.
- Binding skill lens: `frontend-architecture-rules`
- Lens check:
  - action, service, repository responsibilities가 현재 구조에서 import 경계만 봐도 드러나야 한다.
  - full verify는 cycle 4 structural changes 전체를 다시 통과해야 한다.
  - branch 05 follow-up은 branch 06 문서 정렬만 남겨야 한다.
- Verify:
  - `bun run verify`

## TDD Cycle (Slice 12)

- RED: slice 10~11의 경계 조정이 끝나도 branch-wide verification이 없으면 auth, todos, route-entry only policy가 실제 앱 흐름에서 안전한지 닫을 수 없었다.
- GREEN: `bun run verify`를 다시 실행해 typecheck, lint, unit, smoke e2e를 모두 통과시켰다.
- REFACTOR: handoff를 cycle 4 완료 상태 기준으로 압축하고, branch 06에서 이어갈 문서 정렬만 남기도록 다음 액션을 정리했다.

## Verification Result (Slice 12)

- `bun run verify` => pass
  - `bun run typecheck` => pass
  - `bun run lint` => pass
  - `bun run test:unit` => pass (6 files, 26 tests)
  - `bun run test:e2e:smoke` => pass (4 tests)

## Replan (Cycle 5)

- Date: `2026-03-08`
- Trigger:
  - follow-up structure review found that todo Server Actions still act as forwarding-only wrappers, todo components still own `useMutation` wiring, and the repository layer still reads as low-value indirection.
- Replan decision:
  - reopen branch 05 for one more cycle focused on direct Server Actions, feature-local UI mutation hooks, and removal of todo-only wrapper layers.
- Architectural decision:
  - todo Server Actions become the actual mutation implementation boundary.
  - UI mutation orchestration moves into `src/features/todos/hooks/*`.
  - repository/service files are kept only if they still expose a meaningful shared responsibility after the collapse.
