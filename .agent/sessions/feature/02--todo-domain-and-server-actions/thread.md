# Thread

## Meta
- Session Name (== Branch): `feature/02--todo-domain-and-server-actions`
- Branch Pattern: `<prefix>/<branch-number>--<slug-and-so-on>`
- Prefix: `feature`
- Date: 2026-03-06
- Owner: Codex

## Goal
- Todo 도메인 타입/검증/Server Actions와 `/todos` UI(목록/필터/CRUD/토글)를 MVP 범위로 구현한다.
- Planner 단계에서 실행 가능한 TDD 슬라이스와 검증/커밋 단위를 고정한다.

## Done Criteria
1. `create/update/toggle/delete` Server Actions가 사용자 단위 Todo에 대해 동작한다.
2. `/todos`에서 목록/필터(`all/active/completed`)와 생성/수정/토글/삭제 UI가 동작한다.
3. 입력 검증 에러(제목 trim, 1~200자)가 UI 피드백으로 노출된다.

## Out of Scope
1. RLS SQL 정책 확정/검증(브랜치 03 범위).
2. 테스트 하네스 대규모 보강(E2E 시나리오 확장, 브랜치 04 범위).

## Plan
1. Planner Gate: 범위/인터페이스/슬라이스/검증/커밋 계약을 확정한다.
2. Execution Gate: 슬라이스별 `RED -> GREEN -> REFACTOR`를 수행하고 작은 단위로 커밋한다.
3. Hardening/Review/Refactor/Final Verify Gate를 순서대로 완료한다.

## Planner Output (branch-orchestrator: Planner)

### Scope Summary
- In:
  - Todo 타입/입력 스키마(Zod)
  - Todo Server Actions 4종
  - `/todos` 목록/필터/CRUD/토글 UI
  - 기본 접근성 점검(라벨/포커스/콘트라스트)
- Out:
  - RLS 정책 SQL 작성/검증
  - CI/CD/배포 자동화

### Preconditions / Decisions
1. 현재 로컬 `main`에는 브랜치 01(Auth/route guard) 결과가 아직 없음.
2. 실행 시작 전 `feature/01--supabase-auth-and-route-guard`를 `main`에 반영(merge/cherry-pick)한 기준으로 진행한다.
3. 패키지 매니저/검증 명령은 `bun` 기준으로 고정한다.

### Public Interface / Type Changes
1. `Todo`, `CreateTodoInput`, `UpdateTodoInput`, `TodoFilter` 타입 정의.
2. `createTodoAction`, `updateTodoAction`, `toggleTodoAction`, `deleteTodoAction` 공개.
3. `todoTitleSchema`, `createTodoSchema`, `updateTodoSchema`(Zod) 정의.

## Slice 1

- Goal:
  - Todo 도메인 타입과 Zod 입력 스키마를 추가한다.
- ## Done criteria:
  - `Todo`/`CreateTodoInput`/`UpdateTodoInput`/`TodoFilter` 타입이 추가된다.
  - 제목 trim + 1~200자 검증 스키마가 추가된다.
- ## Out of scope:
  - DB 호출/서버 액션 구현
- ## Planned files:
  - `src/app/todos/types.ts`
  - `src/app/todos/schema.ts`
  - `tests/unit/todos-schema.spec.ts`
- ## RED:
  - 제목이 공백 또는 201자일 때 실패해야 하는 unit test를 먼저 작성한다.
- ## GREEN:
  - 최소 Zod 스키마를 구현해 test를 통과시킨다.
- ## REFACTOR:
  - 타입/스키마 export 이름을 도메인 중심으로 정리하고 test 재실행.
- Verify:
  - `bun run test:unit`
  - `bun run typecheck`
- ## Failure recovery:
  - 실패 케이스가 모호하면 에러 메시지 계약을 명시적으로 고정 후 재검증.
- Commit:
  - `✅ test: add todo schema validation cases`

## Slice 2

- Goal:
  - Todo 생성/수정 Server Action을 구현한다.
- ## Done criteria:
  - create/update action이 검증 통과 입력만 처리한다.
  - 실패 시 UI에서 해석 가능한 에러 상태를 반환한다.
- ## Out of scope:
  - 토글/삭제 액션
- ## Planned files:
  - `src/app/todos/actions.ts`
  - `src/app/todos/action-types.ts`
  - `tests/unit/todo-actions-create-update.spec.ts`
- ## RED:
  - invalid input/미인증 상황에서 액션 실패 테스트를 작성한다.
- ## GREEN:
  - 최소 create/update action 구현으로 테스트 통과.
- ## REFACTOR:
  - 에러 매핑/공통 guard 로직 중복 제거 후 테스트 재실행.
- Verify:
  - `bun run test:unit`
  - `bun run typecheck`
- ## Failure recovery:
  - Supabase 호출 경로 실패 시 action state code를 세분화해 원인 추적.
- Commit:
  - `✨ feat: add todo create update server actions`

## Slice 3

- Goal:
  - Todo 토글/삭제 Server Action을 구현한다.
- ## Done criteria:
  - toggle/delete action이 본인 Todo에 대해 동작한다.
  - 존재하지 않는 id 처리 경로가 고정된다.
- ## Out of scope:
  - `/todos` UI 렌더링
- ## Planned files:
  - `src/app/todos/actions.ts`
  - `tests/unit/todo-actions-toggle-delete.spec.ts`
- ## RED:
  - 존재하지 않는 id, 비정상 id 입력 실패 테스트 작성.
- ## GREEN:
  - 최소 toggle/delete action 구현으로 테스트 통과.
- ## REFACTOR:
  - action 공통 쿼리 헬퍼 정리 후 테스트 재실행.
- Verify:
  - `bun run test:unit`
  - `bun run typecheck`
- ## Failure recovery:
  - 업데이트 행 수 0건이면 not-found 상태를 반환하도록 수정.
- Commit:
  - `✨ feat: add todo toggle delete server actions`

## Slice 4

- Goal:
  - `/todos` 목록/필터 read 경로를 구현한다.
- ## Done criteria:
  - `all/active/completed` 필터에 맞춰 목록이 렌더링된다.
  - 빈 상태 UI가 노출된다.
- ## Out of scope:
  - 생성/수정/삭제 폼 상호작용
- ## Planned files:
  - `src/app/todos/page.tsx`
  - `src/components/todos/todo-filter-tabs.tsx`
  - `src/components/todos/todo-list.tsx`
- ## RED:
  - 필터별 기대 목록을 검증하는 렌더링 테스트(또는 명시적 수동 시나리오) 작성.
- ## GREEN:
  - 최소 read query + 필터 UI 연결로 조건 만족.
- ## REFACTOR:
  - 필터 상태 파싱 로직 정리, 접근성 라벨 보강.
- Verify:
  - `bun run lint`
  - `bun run typecheck`
- ## Failure recovery:
  - URL searchParam 파싱 실패 시 `all`로 안전 폴백.
- Commit:
  - `✨ feat: add todo list and filter ui`

## Slice 5

- Goal:
  - 생성/수정/토글/삭제 UI를 action과 연결한다.
- ## Done criteria:
  - 사용자 플로우 기준 CRUD/토글이 화면에서 동작한다.
  - 검증 실패/서버 실패 피드백이 사용자에게 표시된다.
- ## Out of scope:
  - E2E 전체 시나리오 확장
- ## Planned files:
  - `src/components/todos/todo-create-form.tsx`
  - `src/components/todos/todo-edit-dialog.tsx`
  - `src/components/todos/todo-item.tsx`
  - `src/app/todos/page.tsx`
- ## RED:
  - 생성/수정 입력 에러 표시, 삭제/토글 반영 실패 케이스를 먼저 정의.
- ## GREEN:
  - 최소 client/server 연결로 동작 확보.
- ## REFACTOR:
  - 컴포넌트 책임 분리(파일당 단일 export), 중복 폼 로직 정리.
- Verify:
  - `bun run lint`
  - `bun run typecheck`
- ## Failure recovery:
  - action state를 공통 UI 에러 컴포넌트로 매핑해 실패 표시 누락 방지.
- Commit:
  - `✨ feat: connect todo crud ui to server actions`

## Slice 6 (Hardening)

- Goal:
  - 실패 경로/접근성/검증 증거를 보강한다.
- ## Done criteria:
  - 실패 경로(빈 제목/길이 초과/없는 id) 확인 기록이 남는다.
  - 접근성 기본 체크(라벨/포커스/콘트라스트) 완료.
  - 세션 로그에 TDD/검증 결과가 누락 없이 누적된다.
- ## Out of scope:
  - 새로운 기능 추가
- ## Planned files:
  - `.agent/sessions/feature/02--todo-domain-and-server-actions/log.md`
  - `tests/e2e/todos.smoke.spec.ts` (필요 시 최소 보강)
- ## RED:
  - 현재 실패 경로를 놓치는 시나리오를 명시한다.
- ## GREEN:
  - 누락된 실패 경로를 테스트/수동검증으로 채운다.
- ## REFACTOR:
  - 테스트 명칭/로그 형식을 표준화한다.
- Verify:
  - `bun run test:e2e:smoke`
  - `bun run verify`
- ## Failure recovery:
  - flaky가 발생하면 원인 시나리오를 분리해 재현 단계를 로그에 고정.
- Commit:
  - `✅ test: harden todo failure paths and smoke coverage`

### Stage Plan After Planner
1. Execution: `branch-execution-gate` + `tdd` + `git-commit-gitmoji`
2. Hardening: `hardening-gate`
3. Review: `pr-review-check`
4. Refactor: `refactor-pass`
5. Final Verify: `bun run verify` (fallback: `typecheck` -> `lint` -> `test:unit` -> `test:e2e:smoke`)

## Used Skills
- `branch-orchestrator`
- `branch-planner`
- `tdd`

## Implementation Notes
- 주요 결정:
  - Planner만 수행, Execution은 다음 단계에서 시작
  - 브랜치 01 결과가 main에 반영되어야 브랜치 02 실행 가능
- 변경 파일:
  - `.agent/sessions/feature/02--todo-domain-and-server-actions/thread.md`
  - `.agent/sessions/feature/02--todo-domain-and-server-actions/log.md`
- 리스크:
  - 현재 기준선(main)과 브랜치 플랜 의존관계(01 선행) 불일치 가능성

## Verification
- Commands:
  - `git branch --show-current`
  - `test -f .agent/sessions/feature/02--todo-domain-and-server-actions/thread.md`
  - `test -f .agent/sessions/feature/02--todo-domain-and-server-actions/log.md`
- 결과 요약:
  - 브랜치: `feature/02--todo-domain-and-server-actions`
  - 세션 파일 생성 완료

## Fix Log
- 이슈:
  - 브랜치 생성 시 병렬 명령으로 `main` 기준 생성이 깨질 가능성 발생
- 원인:
  - `git checkout main`과 `git checkout -b ...`를 병렬로 실행
- 수정:
  - 브랜치를 삭제 후 `main`에서 순차 재생성
- 재검증:
  - 현재 브랜치가 `feature/02--todo-domain-and-server-actions`인지 확인

## Handoff Pointer
- Write to: `/Users/nagi/Downloads/codex-test/.agent/sessions/feature/02--todo-domain-and-server-actions/handoff.md`
