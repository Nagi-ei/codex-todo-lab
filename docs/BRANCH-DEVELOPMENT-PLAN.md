# Branch Development Plan

## Purpose
PRD와 Master Plan을 실행 가능한 브랜치 단위로 분해하고, 각 브랜치의 완료 조건과 검증 기준을 고정한다.

## Naming Convention
1. Branch format: `<prefix>/<branch-number>--<slug-and-so-on>`
2. Allowed prefixes: `feature`, `ui`, `refactor`, `fix`
3. Session folder: `/Users/nagi/Downloads/codex-test/.ai/sessions/<prefix>/<branch-number>--<slug-and-so-on>/`
4. Base branch: `main`

## UI Branching Strategy
1. 기본 원칙: 기능(Auth/Todo 도메인)과 강하게 결합된 UI는 같은 브랜치에서 함께 구현한다.
2. 현재 프로젝트 적용: 기능 + UI는 `02` 브랜치에서 함께 구현하고, 후속 브랜치는 운영 검증/문서 정리에 집중한다.
3. UI를 별도 브랜치로 분리하는 경우:
- 디자인 시스템 개편처럼 범위가 넓고 독립 검토가 필요할 때
- 기능 개발과 UI 개발을 병렬로 진행해야 할 때
- 시각 리팩터링만 별도 릴리즈하고 싶을 때

## Branch Execution Order

### 0) `main` (completed baseline)
1. Goal
- Next.js + Bun + Tailwind + shadcn/ui baseline 정리
- 공통 유틸/레이아웃/토스터 초기 연결
2. Scope
- 기존 초기화 상태 점검
- `src/app/layout.tsx`에 `sonner` 토스터 연결
- 공통 스타일/디렉터리 구조 최소 정리
3. Done Criteria
- 앱 실행 가능
- shadcn 컴포넌트 import 동작 확인
4. Verification
- `bun run dev`
- `bun run lint`
5. Status
- 완료 커밋: `0d399da`

### 1) `feature/01--supabase-auth-and-route-guard`
1. Goal
- Supabase Auth 이메일 로그인/회원가입/로그아웃 + 보호 라우트 구현
2. Scope
- Supabase client/server 초기화
- `/login` 구현
- `/todos` 보호 라우트 처리
3. Done Criteria
- 비로그인 시 `/todos` 접근 차단
- 로그인 후 `/todos` 접근 가능
4. Verification
- 수동 로그인 플로우 점검
- `bun run lint`

### 2) `feature/02--todo-domain-and-server-actions`
1. Goal
- Todo 도메인 + Server Actions 기반 CRUD/토글/필터 구현
2. Scope
- `todos` 타입/입력 스키마(Zod)
- `create/update/toggle/delete` server actions
- 목록/필터 UI 연결
3. Done Criteria
- CRUD/토글/필터 전부 동작
- 입력 검증 에러가 UI에 표시
4. Verification
- 핵심 플로우 수동 점검
- `bun run lint`

### 3) `feature/03--supabase-rls-and-security-hardening`
1. Goal
- 운영 환경 기준 RLS 데이터 격리 실검증 및 증적 정리
2. Scope
- 이미 반영된 RLS SQL/운영 문서를 기준선으로 고정
- 사용자 A/B 계정으로 read/insert/update/delete 격리 시나리오 실검증
- 검증 결과를 세션 로그/운영 메모에 기록
3. Done Criteria
- 사용자 간 데이터 접근 차단 검증 완료
- 검증 일시, 환경, 계정 역할, 시나리오별 실제 결과가 기록됨
4. Verification
- 수동 권한 검증 기록
5. Status
- 축소됨: 정책 SQL과 runbook은 `02` 브랜치 산출물을 재사용하고, 이 브랜치는 운영 검증 증적 수집에 집중한다.

### 4) `fix/04--test-harness-and-core-scenarios`
1. Goal
- Vitest + Playwright 기반 최소 테스트 체계 구축
2. Scope
- unit: 입력 검증/유틸
- e2e: 로그인, 생성, 토글, 필터, 삭제
3. Done Criteria
- 핵심 테스트 그린
4. Verification
- `bun run test:unit`
- `bun run test:e2e:smoke`
5. Status
- 별도 브랜치 보류: 최소 테스트 체계와 smoke gate는 `02` 브랜치에서 이미 구현/검증되었으므로 독립 브랜치로 진행하지 않는다.

### 5) `refactor/05--docs-and-learning-notes`
1. Goal
- 문서 정리 및 학습 회고 체계 완성
2. Scope
- README 실행/검증 절차 최신화
- `.ai` 운영 문서와 docs 정합성 맞춤
3. Done Criteria
- 새 세션이 문서만 읽고 재진입 가능
4. Verification
- 문서 경로/명령 재현성 점검

## Per-Branch Session Checklist
1. 세션 시작: `plan.md` 생성 + `plans/01-branch-baseline.md` 스냅샷 생성
2. 계획 작성: 목표/완료조건/제외범위
3. 구현: 계획된 범위만 수행
4. 검증: 명령 실행 및 결과 기록
5. 수정: 실패 원인/패치/재검증 기록
6. 종료: `handoff.md` 작성

## Session Document Structure
1. `plan.md`: 현재 유효한 최신 계획만 유지하는 기준 문서
2. `plans/*.md`: 각 cycle/replan 시점의 계획 스냅샷 아카이브
3. `log.md`: 실행 이력, replan 사유, 검증/수정 기록을 누적
4. `handoff.md`: 현재 상태, 남은 이슈, 다음 액션만 요약

## Replan Rule
1. 첫 계획은 `plans/01-branch-baseline.md`로 저장하고 동일 내용을 `plan.md`에 반영한다.
2. 이후 review/fix/refactor 등으로 새 cycle이 열리면 `plans/<nn>-<slug>.md`를 새로 추가한다.
3. 새 cycle 계획이 승인되면 `plan.md`를 최신 내용으로 갱신한다.
4. 왜 계획이 바뀌었는지는 `log.md`에 남긴다.

## Notes
1. 한 번에 하나의 브랜치만 active 상태로 진행한다.
2. 브랜치 종료 기준은 기능 완성 + 검증 통과 + handoff 작성이다.
3. 변경 요청으로 스코프가 바뀌면 이 문서와 Master Plan을 함께 업데이트한다.
4. 2026-03-08 replan: `03`은 운영 검증 브랜치로 축소했고, `04`는 `02`에 흡수된 완료 범위로 정리했다.
