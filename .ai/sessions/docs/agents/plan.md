# Plan

## Meta
- Session Name (== Branch): `codex/docs-agents`
- Branch Pattern: exception for explicit user request to work on a docs-focused branch
- Prefix: `docs`
- Date: `2026-03-07`
- Owner: `Codex`
- Current Cycle: `02-plan-structure-update`
- Plan Snapshot: `plans/02-plan-structure-update.md`

## Goal
- 루트 `agents.md`를 추가해 React/Next.js 개발 규칙을 강제한다.
- 사용자 요청 규칙을 문서화하고 리뷰 체크리스트까지 포함한다.

## Done Criteria
1. 루트 `agents.md`에 구조, 상태 관리, 서버 경계 규칙이 정리된다.
2. 사용자 요청 항목이 빠짐없이 반영된다.
3. 검증 명령 결과를 세션 로그에 남긴다.

## Out of Scope
1. 실제 코드 리팩터링
2. 라이브러리 설치

## Active Slices
1. 기존 문서, 스크립트, 구조를 확인해 적용 가능한 규칙만 추린다.
2. 루트 `agents.md` 초안을 작성하고 예외 기준까지 명시한다.
3. 검증 후 세션 로그에 결과를 남긴다.

## Used Skills
- `branch-planner`
- `tdd`
- `git-commit-gitmoji`

## Implementation Notes
- 주요 결정: Route Handler 전면 금지 대신 예외를 둔 기본 규칙으로 문서화
- 변경 파일: `agents.md`, `.ai/sessions/docs/agents/plan.md`, `.ai/sessions/docs/agents/log.md`
- 리스크: 현 구조에 `src/features`가 아직 없어서 후속 작업에서 점진 적용이 필요함

## Verification
- Commands:
  - `bun run verify`
  - `bun run typecheck`
  - `bun run test:unit`
  - `bun run test:e2e:smoke`
- 결과 요약:
  - `bun run verify` 통과
  - `typecheck`, `lint`, `test:e2e:smoke` 모두 통과
  - `test:unit`은 현재 대상 파일이 없어 `No test files found, exiting with code 0`로 종료됨

## Open Risks
- 현재 세션 산출물 중 과거 `thread.md`를 참조하는 역사적 로그는 남아 있다.

## Handoff Pointer
- Write to: `/Users/nagi/Downloads/codex-test/.ai/sessions/docs/agents/handoff.md`
- Snapshot archive example: `/Users/nagi/Downloads/codex-test/.ai/sessions/docs/agents/plans/01-branch-baseline.md`
