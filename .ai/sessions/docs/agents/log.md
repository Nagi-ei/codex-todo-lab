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

## TDD Cycle
- RED: 추가 피드백으로 남겼던 `Server Component 기본`, 최소 props 전달, mutation 후속 처리, `src/features/<domain>` 강제 기준이 문서상 약하다는 점을 보강 대상으로 정의했다.
- GREEN: `"use client"` 최소 범위, serializable/minimal props, invalidate/refresh 전략 명시, `src/features/<domain>` 배치 규칙을 문서와 리뷰 체크리스트에 추가했다.
- REFACTOR: 기존 규칙과 겹치는 표현은 피하고, 실제 리뷰 기준으로 바로 사용할 수 있는 문장으로 정리했다.

## TDD Cycle
- RED: `thread.md` 중심 구조는 최신 계획과 계획 히스토리를 동시에 담기 어렵고, 재사이클 시 현재 기준 문서와 과거 스냅샷이 섞인다는 문제를 확인했다.
- GREEN: 세션 구조를 `plan.md + plans/*.md + log.md + handoff.md`로 정리하고, 템플릿/브랜치 운영 문서/전역 스킬을 같은 모델로 맞췄다.
- REFACTOR: `plan.md`는 최신 기준만, `plans/*.md`는 스냅샷 아카이브, `log.md`는 append-only 실행 기록이라는 역할 분리를 명시했다.

## TDD Cycle
- RED: 역할별 폴더 구조를 강제하는 전용 문서가 없어 새 파일 배치 기준이 `AGENTS.md` 일부 규칙에 흩어져 있었고, scaffold 예시도 별도 문서로 존재하지 않았다.
- GREEN: 루트에 `SCAFFOLD_STRUCTURE.md`를 추가해 canonical structure, 배치 규칙, 금지 규칙, 새 도메인 scaffold, 판단 순서를 문서화했다.
- REFACTOR: 구조 문서는 별도 루트 문서로 분리하고, 세션 문서는 cycle 기록만 남기도록 정리했다.

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
