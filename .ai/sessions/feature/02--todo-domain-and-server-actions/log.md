# Session Log

## used_skills
- `branch-orchestrator`
- `branch-planner`
- `tdd`

## Stage Progress
- Planner: 완료
- Execution: 미시작
- Hardening: 미시작
- Review: 미시작
- Refactor: 미시작
- Final Verify: 미시작

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
