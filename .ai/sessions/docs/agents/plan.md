# Plan

## Meta
- Session Name (== Branch): `codex/docs-agents`
- Branch Pattern: exception for explicit user request to work on a docs-focused branch
- Prefix: `docs`
- Date: `2026-03-08`
- Owner: `Codex`
- Current Cycle: `03-scaffold-structure`
- Plan Snapshot: `plans/03-scaffold-structure.md`

## Goal
- 프로젝트 루트에 `SCAFFOLD_STRUCTURE.md`를 추가해 역할별 폴더 구조를 강제한다.
- 새 파일 배치 기준과 도메인 scaffold 예시를 짧고 명확하게 문서화한다.

## Done Criteria
1. `SCAFFOLD_STRUCTURE.md`에 canonical structure와 배치 규칙이 정리된다.
2. `src/app`, `src/features`, `src/components`, `src/lib` 역할이 분명하게 구분된다.
3. 검증 명령 결과를 세션 로그에 남긴다.

## Out of Scope
1. 기존 코드 이동
2. 실제 구조 리팩터링

## Active Slices
1. 현재 폴더 구조와 기존 규칙 문서를 확인한다.
2. 루트 `SCAFFOLD_STRUCTURE.md`에 canonical structure와 금지 규칙을 작성한다.
3. 검증 후 세션 로그와 handoff를 갱신한다.

## Used Skills
- `branch-planner`
- `tdd`
- `git-commit-gitmoji`

## Implementation Notes
- 주요 결정: 역할별 폴더 구조 강제 문서는 루트 별도 문서로 분리하고, `src/features/<domain>`을 새 기능의 기본 시작점으로 다시 명시
- 변경 파일: `SCAFFOLD_STRUCTURE.md`, `.ai/sessions/docs/agents/plan.md`, `.ai/sessions/docs/agents/log.md`, `.ai/sessions/docs/agents/handoff.md`
- 리스크: 현재 코드베이스는 target scaffold와 완전히 일치하지 않으므로 문서가 즉시 강제 기준 역할만 수행함

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
- 기존 코드 구조와 새 scaffold 문서 사이에는 아직 정리되지 않은 간극이 있다.

## Handoff Pointer
- Write to: `/Users/nagi/Downloads/codex-test/.ai/sessions/docs/agents/handoff.md`
- Snapshot archive example: `/Users/nagi/Downloads/codex-test/.ai/sessions/docs/agents/plans/01-branch-baseline.md`
