# agents.md

## Goal
- Next.js App Router + React + TypeScript 기준으로 코드 일관성을 강제한다.
- 작업 유형에 맞는 전용 스킬을 우선 적용해 일관된 구현과 검증 흐름을 강제한다.

## Done Criteria
1. 새 기능이 추가되어도 파일 책임이 바로 읽힌다.
2. 비즈니스 로직, 서버 호출, UI 상태가 섞이지 않는다.
3. 리뷰 시 구조 위반을 빠르게 지적할 수 있다.

## Out of Scope
1. 디자인 토큰 전면 개편
2. 상태 관리 라이브러리 추가 도입
3. 백엔드 아키텍처 변경

## Core Rules
1. React 컴포넌트는 200줄을 넘기지 않는다. 200줄에 가까워지면 하위 프레젠테이션 컴포넌트나 hook으로 분리한다.
2. `any`는 금지한다. 불확실한 값은 `unknown`으로 받고 좁혀서 사용한다.
3. 새 유틸, helper, formatter를 만들기 전에 기존 `src/lib`와 도메인 유틸을 검색한다.
4. 새 파일 배치와 역할별 폴더 구조는 [`SCAFFOLD_STRUCTURE.md`](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md)를 기준으로 따른다.

## Skill Routing
1. 프론트엔드, React, Next.js App Router, form, state, Server Action, TanStack Query, route boundary, 파일 배치 작업은 [`frontend-architecture-rules`](/Users/nagi/.agents/skills/frontend-architecture-rules/SKILL.md)를 우선 적용한다.
2. 역할별 폴더 구조와 파일 배치 판단은 [`SCAFFOLD_STRUCTURE.md`](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md)와 `frontend-architecture-rules`를 함께 따른다.
3. 브랜치 단위의 비사소한 작업은 [`branch-cycle-orchestrator`](/Users/nagi/.agents/skills/branch-cycle-orchestrator/SKILL.md)를 기본 흐름으로 사용한다.
4. 리뷰 단계는 [`pr-review-check`](/Users/nagi/.agents/skills/pr-review-check/SKILL.md)를 기준으로 수행한다.
5. `branch-cycle-orchestrator`를 사용하는 경우, task classification과 stage skill intensity 규칙을 그대로 따른다.

## Structure Reference
1. 역할별 폴더 구조의 정본은 [`SCAFFOLD_STRUCTURE.md`](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md)다.
2. 프론트엔드 세부 아키텍처 규칙의 정본은 [`frontend-architecture-rules`](/Users/nagi/.agents/skills/frontend-architecture-rules/SKILL.md)다.
3. `AGENTS.md`는 전역 원칙과 스킬 라우팅을 정의하고, 세부 구현/리뷰 기준은 해당 스킬 문서를 따른다.
4. 새 기능은 항상 `SCAFFOLD_STRUCTURE.md`의 `Decision Order`와 `Placement Rules`를 먼저 확인하고 시작한다.

## Default Decision
- 애매하면 Server Component 우선
- 애매하면 Server Action 우선
- 애매하면 기존 컴포넌트/유틸 재사용 우선
- 애매하면 작은 파일과 단일 책임 우선
