# Plan

## Meta
- Session Name (== Branch): `codex/docs-agents`
- Branch Pattern: exception for explicit user request to work on a docs-focused branch
- Prefix: `docs`
- Date: `2026-03-08`
- Owner: `Codex`
- Current Cycle: `05-agents-skill-routing`
- Plan Snapshot: `plans/05-agents-skill-routing.md`

## Goal
- `AGENTS.md`에서 프론트엔드/리뷰 중복 규칙을 줄이고 관련 스킬을 정본으로 참조하게 만든다.
- `AGENTS.md`를 전역 원칙과 스킬 라우팅 문서로 더 명확히 정리한다.

## Done Criteria
1. `AGENTS.md`에서 프론트엔드 상세 아키텍처 규칙 중복이 제거된다.
2. 리뷰 기준이 `pr-review-check`와 `branch-cycle-orchestrator` 참조 중심으로 정리된다.
3. 검증 명령 결과를 세션 로그에 남긴다.

## Out of Scope
1. 기존 코드 이동
2. 전역 스킬 자체의 내용 수정

## Active Slices
1. `AGENTS.md`와 스킬 문서 사이의 중복 구간을 확인한다.
2. `AGENTS.md`를 전역 원칙과 스킬 라우팅 중심으로 축약한다.
3. 검증 후 세션 로그와 handoff를 갱신한다.

## Used Skills
- `branch-planner`
- `tdd`
- `git-commit-gitmoji`

## Implementation Notes
- 주요 결정: `AGENTS.md`는 전역 원칙과 스킬 라우팅만 유지하고, 프론트엔드 상세 규칙과 리뷰 기준은 전용 스킬을 정본으로 사용
- 변경 파일: `AGENTS.md`, `.agent/sessions/docs/agents/plan.md`, `.agent/sessions/docs/agents/log.md`, `.agent/sessions/docs/agents/handoff.md`
- 리스크: 스킬 문서가 변경되면 `AGENTS.md`의 라우팅 링크가 계속 유효해야 함

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
- 기존 코드 구조와 scaffold 기준 사이의 간극은 여전히 남아 있다.

## Handoff Pointer
- Write to: `/Users/nagi/Downloads/codex-test/.agent/sessions/docs/agents/handoff.md`
- Snapshot archive example: `/Users/nagi/Downloads/codex-test/.agent/sessions/docs/agents/plans/01-branch-baseline.md`
