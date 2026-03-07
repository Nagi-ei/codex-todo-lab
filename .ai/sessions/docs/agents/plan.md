# Plan

## Meta
- Session Name (== Branch): `codex/docs-agents`
- Branch Pattern: exception for explicit user request to work on a docs-focused branch
- Prefix: `docs`
- Date: `2026-03-08`
- Owner: `Codex`
- Current Cycle: `04-agents-scaffold-reference`
- Plan Snapshot: `plans/04-agents-scaffold-reference.md`

## Goal
- `AGENTS.md`에서 폴더 구조 중복을 줄이고 `SCAFFOLD_STRUCTURE.md`를 정본으로 참조하게 만든다.
- 아키텍처 원칙 문서와 구조 문서의 역할을 분리한다.

## Done Criteria
1. `AGENTS.md`에서 폴더 구조 세부 규칙 중복이 제거된다.
2. 구조 관련 판단 기준이 `SCAFFOLD_STRUCTURE.md` 참조로 일원화된다.
3. 검증 명령 결과를 세션 로그에 남긴다.

## Out of Scope
1. 기존 코드 이동
2. `SCAFFOLD_STRUCTURE.md` 자체의 대규모 확장

## Active Slices
1. `AGENTS.md`와 `SCAFFOLD_STRUCTURE.md`의 중복 구간을 확인한다.
2. `AGENTS.md`를 원칙 중심으로 축약하고 구조 문서는 참조로 연결한다.
3. 검증 후 세션 로그와 handoff를 갱신한다.

## Used Skills
- `branch-planner`
- `tdd`
- `git-commit-gitmoji`

## Implementation Notes
- 주요 결정: `AGENTS.md`는 아키텍처 원칙과 리뷰 기준만 유지하고, 파일 배치 규칙은 `SCAFFOLD_STRUCTURE.md`를 정본으로 사용
- 변경 파일: `AGENTS.md`, `.ai/sessions/docs/agents/plan.md`, `.ai/sessions/docs/agents/log.md`, `.ai/sessions/docs/agents/handoff.md`
- 리스크: 구조 규칙이 두 문서로 분리되므로 링크가 깨지지 않도록 유지가 필요함

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
- Write to: `/Users/nagi/Downloads/codex-test/.ai/sessions/docs/agents/handoff.md`
- Snapshot archive example: `/Users/nagi/Downloads/codex-test/.ai/sessions/docs/agents/plans/01-branch-baseline.md`
