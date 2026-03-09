# Plan

## Meta
- Session Name (== Branch): `feature/02--todo-domain-and-server-actions`
- Branch Pattern: `<prefix>/<branch-number>--<slug-and-so-on>`
- Prefix: `feature`
- Date: 2026-03-08
- Owner: Codex
- Current Cycle: `todo-review-fixes`
- Plan Snapshot: `review findings -> smoke gate inclusion -> read failure handling -> migration doc alignment`

## Goal
- 리뷰에서 발견된 세 가지 이슈를 수정한다: todo smoke 미포함, `/todos` read 실패 은닉, migration 문서 드리프트.

## Done Criteria
1. todo CRUD/filter E2E가 `bun run test:e2e:smoke`에 포함된다.
2. `/todos` read 실패 시 빈 상태가 아닌 명시적 에러 상태가 표시된다.
3. `supabase/README.md`가 CLI 우선 흐름으로 정리되고 `bun run verify`가 통과한다.

## Out of Scope
1. 새로운 todo 기능 추가
2. auth flow 변경

## Active Slices
1. Slice 13: smoke gate에 todo flow 포함
2. Slice 14: `/todos` read failure surface
3. Slice 15: Supabase migration 문서 CLI 우선 정렬

## Used Skills
- `branch-orchestrator`
- `branch-planner`
- `tdd`
- `branch-execution-gate`
- `git-commit-gitmoji`
- `hardening-gate`
- `pr-review-check`
- `refactor-pass`

## Implementation Notes
- 주요 결정:
  - smoke 태그 추가로 verify 경로에 todo 핵심 플로우를 직접 포함
  - read error는 silent empty-state 대신 페이지 내 에러 패널로 노출
  - migration 적용 기본 경로는 CLI(`link -> db push`)로 문서화
- 변경 파일:
  - `tests/e2e/todos.smoke.spec.ts`
  - `src/app/todos/page.tsx`
  - `supabase/README.md`
  - `.agent/sessions/feature/02--todo-domain-and-server-actions/log.md`
- 리스크:
  - smoke에 todo 시나리오가 들어오면 환경 의존 실패가 verify를 막을 수 있음

## Verification
- Commands:
  - `bun run test:e2e:smoke`
  - `bun run test:unit`
  - `bun run typecheck`
  - `bun run lint`
  - `bun run verify`
- 결과 요약:
  - `test:e2e:smoke`에 todo smoke 포함 후 통과
  - `/todos` read error 유닛 테스트 추가 및 통과
  - 최종 `bun run verify` 통과

## Open Risks
- 원격 Supabase 상태에 따라 todo smoke가 flaky할 수 있음
- `supabase/.temp/`는 CLI 작업 산출물로 별도 정리 필요

## Handoff Pointer
- Write to: `/Users/nagi/Downloads/codex-test/.agent/sessions/feature/02--todo-domain-and-server-actions/handoff.md`
- Snapshot archive example: `/Users/nagi/Downloads/codex-test/.agent/sessions/feature/02--todo-domain-and-server-actions/plans/01-branch-baseline.md`
