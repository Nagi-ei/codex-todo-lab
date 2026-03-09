# Master Plan

## Canonical Documents
- PRD (canonical): `/Users/nagi/Downloads/codex-test/docs/PRD.md`
- Branch plan (canonical): `/Users/nagi/Downloads/codex-test/docs/BRANCH-DEVELOPMENT-PLAN.md`
- Master plan pointer: `/Users/nagi/Downloads/codex-test/.agent/master-plan.md`
- PRD pointer: `/Users/nagi/Downloads/codex-test/.agent/PRD.md`
- Branch plan pointer: `/Users/nagi/Downloads/codex-test/.agent/branch-plan.md`

## Product Goal
- 학습용 Todo MVP를 Next.js + Supabase + shadcn/ui + Tailwind로 구현한다.
- Codex 협업 워크플로우(계획/구현/검증/수정)와 세션 handoff 습관을 정착시킨다.

## Scope (In)
1. 이메일 회원가입/로그인/로그아웃 (Supabase Auth)
2. 사용자별 Todo CRUD
3. 완료 토글, 필터(전체/진행중/완료)
4. shadcn/ui + Tailwind UI
5. Supabase RLS 기반 데이터 격리
6. Playwright E2E(핵심 플로우) + Vitest 최소 유닛
7. 프론트엔드 구조 리팩토링 및 README + 학습 노트 문서화

## Milestones
1. M1 Bootstrap: Next.js, Tailwind, shadcn/ui 초기화
2. M2 Auth: Supabase 연동 + 이메일 인증 + 보호 라우트
3. M3 Todo: Server Actions 기반 CRUD/토글/필터
4. M4 Quality: 운영 검증(A/B RLS) 및 남은 결함 점검
5. M5 Refactor: 프론트엔드 구조 정렬 및 책임 분리
6. M6 Docs: 운영 가이드, 학습 노트, handoff 정리

## Public Interfaces / Types
1. Types
- `Todo`
- `CreateTodoInput`
- `UpdateTodoInput`
- `TodoFilter = "all" | "active" | "completed"`
2. Server Actions
- `createTodoAction(input)`
- `updateTodoAction(id, input)`
- `toggleTodoAction(id)`
- `deleteTodoAction(id)`

## Data Model (Supabase)
- `todos`
1. `id uuid primary key default gen_random_uuid()`
2. `user_id uuid not null references auth.users(id) on delete cascade`
3. `title text not null check (char_length(title) between 1 and 200)`
4. `is_completed boolean not null default false`
5. `created_at timestamptz not null default now()`
6. `updated_at timestamptz not null default now()`

## Security / Validation
1. 미로그인 사용자는 `/login`으로 리디렉트
2. RLS 정책: `auth.uid() = user_id` 기반 `select/insert/update/delete`
3. Zod 검증: `title` trim 후 빈 값 금지, 최대 길이 200
4. `SUPABASE_SERVICE_ROLE_KEY`는 서버 코드에서만 사용

## Acceptance Tests
1. 회원가입/로그인 후 `/todos` 접근 가능
2. Todo 생성/수정/토글/삭제 동작
3. 필터(전체/진행중/완료) 동작
4. 사용자 A/B 간 데이터 분리 확인
5. `npm run typecheck`, `npm run test:unit`, `npm run test:e2e:smoke` 통과

## Branch Map (Pattern)
- 브랜치 형식: `<prefix>/<branch-number>--<slug-and-so-on>`
1. `main` (bootstrap baseline 완료, commit `0d399da`)
2. `feature/01--supabase-auth-and-route-guard`
3. `feature/02--todo-domain-and-server-actions`
4. `feature/03--supabase-rls-and-security-hardening` (운영 검증 전용으로 축소)
5. `fix/04--test-harness-and-core-scenarios` (별도 진행 보류, `02`에 흡수)
6. `refactor/05--frontend-architecture-alignment`
7. `refactor/06--docs-and-learning-notes`

## Global Risks
1. Supabase 환경변수 누락 또는 키 오용
2. RLS 정책 불완전으로 인한 데이터 노출
3. E2E flaky 테스트

## Decision Log
- 2026-02-20: API Route Handler 대신 Server Actions 사용
- 2026-02-20: In Scope만 구현, Out Scope는 제외
- 2026-02-20: 브랜치명과 세션명을 동일하게 관리
- 2026-03-08: `feature/03--supabase-rls-and-security-hardening`를 운영 검증 브랜치로 축소
- 2026-03-08: 최소 테스트 체계는 `feature/02--todo-domain-and-server-actions`에 흡수되었으므로 `fix/04--test-harness-and-core-scenarios`는 별도 진행 보류
- 2026-03-08: `05` 브랜치는 코드/구조 리팩토링 전용으로 재정의하고, 문서 정리는 `06` 브랜치로 분리
