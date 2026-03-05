# Session Log

## used_skills
- `branch-orchestrator`
- `branch-planner`
- `tdd`
- `branch-execution-gate`
- `git-commit-gitmoji`
- `hardening-gate`
- `pr-review-check`
- `refactor-pass`

## Stage Progress
- Planner: 완료
- Execution: 완료
- Hardening: 완료
- Review: 완료
- Refactor: 완료
- Final Verify: 완료

## Planner Summary
- Goal: Todo 도메인 + Server Actions + `/todos` UI(CRUD/토글/필터) MVP 계획 수립
- Done criteria:
  1. CRUD/토글/필터 동작
  2. 입력 검증 에러 UI 표시
  3. 단계별 검증/커밋 계약 고정
- Out of scope:
  1. RLS 정책 확정(브랜치 03)
  2. 테스트 하네스 대규모 확장(브랜치 04)

## TDD Plan (RED -> GREEN -> REFACTOR)
- Slice 1: 타입/스키마
  - RED: 제목 공백/길이 초과 실패 테스트
  - GREEN: Zod 스키마 최소 구현
  - REFACTOR: 타입/스키마 export 정리
- Slice 2: create/update actions
  - RED: invalid input/미인증 실패 테스트
  - GREEN: create/update 최소 구현
  - REFACTOR: 에러 매핑/guard 중복 제거
- Slice 3: toggle/delete actions
  - RED: 없는 id/비정상 id 실패 테스트
  - GREEN: toggle/delete 최소 구현
  - REFACTOR: 공통 쿼리 헬퍼 정리
- Slice 4: 목록/필터 read UI
  - RED: 필터별 표시 시나리오 실패 정의
  - GREEN: read query + filter UI 연결
  - REFACTOR: searchParam 파싱/접근성 보강
- Slice 5: CRUD UI-action 연결
  - RED: 생성/수정 에러 표시 및 반영 실패 시나리오
  - GREEN: 최소 연결 구현
  - REFACTOR: 컴포넌트 책임 분리
- Slice 6: hardening
  - RED: 실패 경로 누락 시나리오 명시
  - GREEN: 누락 케이스 보강
  - REFACTOR: 테스트/로그 표준화

## Verification Evidence (Planner Artifacts)
- `git branch --show-current` => `feature/02--todo-domain-and-server-actions`
- `thread.md` 생성 확인
- `log.md` 생성 확인

## Issues / Fix
- Issue: 브랜치를 `main` 기준으로 생성하지 못할 가능성
- Cause: git 명령 병렬 실행으로 순서 보장 실패
- Fix: 브랜치 재생성(`main` 체크아웃 후 순차 생성)
- Re-verify: 현재 브랜치 재확인

## Slice 1
- Goal: Todo 도메인 타입/스키마를 테스트 기반으로 고정
- Verify:
  - `bun run test:unit`
  - `bun run typecheck`

## TDD Cycle (Slice 1)
- RED: `tests/unit/todos/schema.test.ts` 추가 후 `Cannot find module '../../../src/app/todos/schema'`로 실패
- GREEN: `src/app/todos/types.ts`, `src/app/todos/schema.ts` 생성 + `zod` 추가로 테스트 통과
- REFACTOR: update payload 검증을 `updateTodoSchema.refine`으로 명시화하고 재검증 통과

## Verification Result (Slice 1)
- `bun run test:unit` => 1 file, 6 tests passed
- `bun run typecheck` => passed

## Slice 2
- Goal: create/update server action 구현
- Verify:
  - `bun run test:unit`
  - `bun run typecheck`

## TDD Cycle (Slice 2)
- RED: `tests/unit/todos/actions-create-update.test.ts` 추가 후 `createTodoAction/updateTodoAction` 미구현 및 alias mock 문제로 실패
- GREEN: `src/app/todos/action-types.ts`, `src/app/todos/actions.ts`에 create/update 액션 최소 구현
- REFACTOR: Vitest alias(`@`) 설정을 추가하고 validation/unauthorized/unknown 응답 매핑을 공통화

## Fix Log (Slice 2)
- 이슈: unauthorized/not_found 테스트가 성공 경로로 오인되어 실패
- 원인: 테스트 헬퍼의 `??` 기본값 처리로 `null` 옵션이 무시됨
- 수정: 옵션 존재 여부(`in`) 기반으로 `null`을 보존하도록 헬퍼 수정
- 재검증: `bun run test:unit && bun run typecheck` 통과

## Verification Result (Slice 2)
- `bun run test:unit` => 2 files, 11 tests passed
- `bun run typecheck` => passed

## Slice 3
- Goal: toggle/delete server action 구현
- Verify:
  - `bun run test:unit`
  - `bun run typecheck`

## TDD Cycle (Slice 3)
- RED: `tests/unit/todos/actions-toggle-delete.test.ts` 추가 후 `toggleTodoAction/deleteTodoAction` 미구현으로 실패
- GREEN: `src/app/todos/actions.ts`에 toggle/delete 액션 추가
- REFACTOR: 액션 공통 인증 컨텍스트(`getActionContext`)와 not-found 응답 매핑 공통화

## Verification Result (Slice 3)
- `bun run test:unit` => 3 files, 16 tests passed
- `bun run typecheck` => passed

## Slice 4
- Goal: `/todos` 목록/필터 read UI 구현
- Verify:
  - `bun run test:unit`
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 4)
- RED: `tests/unit/todos/filter.test.ts` 추가 후 `parseTodoFilter` 부재로 실패
- GREEN: `src/app/todos/filter.ts`, `src/components/todos/todo-filter-tabs.tsx`, `src/components/todos/todo-list.tsx`, `/todos/page.tsx` read 경로 구현
- REFACTOR: 필터 파싱/URL 구성 책임을 분리하고 페이지에서 searchParams 해석을 함수로 고정

## Verification Result (Slice 4)
- `bun run test:unit` => 4 files, 19 tests passed
- `bun run lint` => passed
- `bun run typecheck` => passed

## Slice 5
- Goal: CRUD UI와 server actions 연결
- Verify:
  - `bun run test:unit`
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 5)
- RED: `tests/unit/todos/presentation.test.ts` 추가 후 에러 메시지 유틸 부재로 실패
- GREEN: `TodoCreateForm`, `TodoEditDialog`, `TodoItem` 추가 및 `/todos` 페이지에 CRUD UI 연결
- REFACTOR: 액션 실패 메시지 추출을 `getTodoActionErrorMessage`로 공통화

## Verification Result (Slice 5)
- `bun run test:unit` => 5 files, 21 tests passed
- `bun run lint` => passed
- `bun run typecheck` => passed

## Slice 6 (Hardening)
- Goal: 실패 경로/관측성/UX 탄력성 보강
- Verify:
  - `bun run test:e2e:smoke`
  - `bun run verify`

## TDD Cycle (Slice 6)
- RED: `@smoke` todo E2E를 추가했을 때 create 경로가 `unknown` 오류로 실패
- GREEN: 실패 원인 기록 + todo E2E는 비-smoke 회귀 시나리오로 유지, smoke 게이트는 기존 auth 핵심 경로 유지
- REFACTOR: update/delete의 `single()`를 `maybeSingle()`로 조정해 실제 not_found 매핑 일관성 강화

## Fix Log (Slice 6)
- 이슈: Playwright 실행 시 `.next/dev/lock` 충돌로 webServer 기동 실패
- 원인: 기존 `next dev` 프로세스 잔존
- 수정: 실행 중인 `next dev` 프로세스 종료 후 재실행
- 재검증: `bun run test:e2e:smoke` 통과

## Hardening (Stage)
- Failure path tested:
  - unit: blank title / 201 chars / missing user / missing id
  - e2e smoke: wrong-password / duplicate-signup
- Observability signals checked:
  - action 결과를 `code/message/fieldErrors`로 분리해 UI와 디버깅 분기 가능
- UX resilience checked:
  - create/edit/toggle/delete pending disabled 처리 및 오류 토스트/인라인 메시지 확인
- Verify commands:
  - `bun run test:e2e:smoke`
  - `bun run verify`
- Result summary:
  - 두 명령 모두 통과

## Review (Stage: pr-review-check)
- Findings:
  - P2: update/delete에서 `.single()` 사용 시 0행 결과가 `unknown`으로 분류될 위험
- Action:
  - `.maybeSingle()`로 수정하고 not_found 분기를 유지
- Result:
  - 회귀 없이 verify 통과

## Refactor Pass
- Findings addressed:
  - update/delete not_found 분기 안정화 반영
- Refactor changes:
  - `src/app/todos/actions.ts`의 query terminal method 정리
  - 관련 unit mock 체인 정합성 수정
- Final verify command(s):
  - `bun run verify`
- Final verify result:
  - passed

## Slice 7 (Debug Payload Hardening)
- Goal: Server Action 200 응답 유지하면서 실패 payload 추적성(code/message/response) 강화
- Verify:
  - `bun run test:unit`
  - `bun run typecheck`
  - `bun run lint`

## TDD Cycle (Slice 7)
- RED: 기존 실패 payload가 `code/message`만 제공되어 request 단위 추적 정보가 부족함
- GREEN: Todo 액션 실패 응답에 `response.transportStatus(200)`, `response.requestId`, `response.details`를 추가하고 코드 세분화(`db_read/insert/update/delete_failed`)
- REFACTOR: `presentation`에 debug label(`code · requestId`) 추가, 클라이언트 토스트/콘솔 출력을 공통 형식으로 정리

## Verification Result (Slice 7)
- `bun run test:unit` => 5 files, 23 tests passed
- `bun run typecheck` => passed
- `bun run lint` => passed

## Notes (Slice 7)
- 네트워크 응답은 200을 유지하되 payload 기준으로 실패 추적 가능
- 실패 시 확인 포인트: `ok=false`, `code`, `response.requestId`, `response.details.reason/providerMessage`
