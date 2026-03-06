# Log

## Goal
- 루트 `agents.md`를 추가해 React/Next.js 개발 규칙을 강제한다.

## Done Criteria
1. 사용자 요청 규칙이 모두 문서에 반영된다.
2. 리뷰 체크리스트와 예외 기준이 포함된다.
3. 검증 결과와 사용 스킬이 기록된다.

## Out of Scope
1. 앱 코드 구조 변경
2. 의존성 추가

## Used Skills
- `branch-planner`
- `tdd`
- `git-commit-gitmoji`

## TDD Cycle
- RED: 사용자 요구사항을 체크리스트로 분해했고, 현재 루트에 강제용 `agents.md`가 없어 기준 문서가 부재한 상태를 실패 조건으로 정의했다.
- GREEN: `agents.md`에 컴포넌트 크기, 상태 관리, server action, React Query, 폴더 구조, 리뷰 체크리스트를 작성했다.
- REFACTOR: Route Handler 전면 금지처럼 과도한 규칙은 webhook/public endpoint 예외를 둔 기본 규칙으로 다듬었다.

## Verification
- Commands:
  - `bun run verify`
- 결과 요약:
  - `typecheck` 통과
  - `lint` 통과
  - `test:unit`은 현재 `tests/unit/**/*.test.ts`가 없어 `No test files found, exiting with code 0`
  - `test:e2e:smoke` 통과 (3 passed)

## Fix Log
- 이슈: 없음
- 원인: 없음
- 수정: 없음
- 재검증: `bun run verify` 통과
