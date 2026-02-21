# Thread

## Meta
- Session Name (== Branch): `feature/01--supabase-auth-and-route-guard`
- Branch Pattern: `<prefix>/<branch-number>--<slug-and-so-on>`
- Prefix: `feature`
- Date: `2026-02-22`
- Owner: `Codex (GPT-5)`

## Goal
- Supabase Auth(이메일 회원가입/로그인/로그아웃) 연결과 보호 라우트(`/todos`)를 최소 구현한다.

## Done Criteria
1. `/login` 페이지에서 이메일/비밀번호 기반 회원가입/로그인 액션이 동작한다.
2. `/todos` 접근 시 비인증 사용자는 `/login`으로 리디렉트된다.
3. 인증 사용자는 `/todos` 화면과 로그아웃 액션을 사용할 수 있다.

## Out of Scope
1. Todo CRUD/필터 기능 구현
2. RLS 정책 SQL 확정 및 A/B 사용자 격리 검증

## Plan
1. RED: 실패 검증 시나리오를 세션 로그에 명시한다.
2. GREEN: Supabase 클라이언트/서버 유틸, `/login`, `/todos`를 최소 구현한다.
3. REFACTOR: 접근성/구조 정리 후 lint로 회귀 확인한다.

## Replanned Slices (Branch Slice Execution Gate)
1. Slice 1: RED 시나리오와 Auth action state 타입 정의
2. Slice 2: login action 상태 반환 전환(redirect 실패 흐름 제거)
3. Slice 3: signup action 상태 반환 + `/auth/check-email` 성공 분기
4. Slice 4: shadcn Tabs 도입 및 인증 화면 골격 분리
5. Slice 5: `LoginForm` 분리 + 인라인 에러
6. Slice 6: `SignupForm` 분리 + 인라인 에러 + toast 보조
7. Slice 7: 접근성/문구 리팩터 + lint/typecheck 재검증
8. Slice 8: Playwright 인프라(`playwright.config.ts`) 추가
9. Slice 9: E2E smoke(회원가입 -> 로그인 -> `/todos`) 작성/검증

## Used Skills
- `tdd-thread-flow`
- `git-commit-gitmoji`
- `branch-slice-execution-gate`
- `skill-creator`

## Implementation Notes
- 주요 결정:
  - Supabase Auth는 `@supabase/ssr` 기반 브라우저/서버 클라이언트로 초기화
  - 보호 라우트는 우선 `src/app/todos/page.tsx` 서버 컴포넌트에서 `getUser()`로 가드
  - 테스트 인프라 미구축 상태라 RED는 명시적 실패 시나리오로 기록
- 변경 파일:
  - `.ai/sessions/feature/01--supabase-auth-and-route-guard/thread.md`
  - `.ai/sessions/feature/01--supabase-auth-and-route-guard/log.md`
  - `src/lib/supabase/env.ts`
  - `src/lib/supabase/client.ts`
  - `src/lib/supabase/server.ts`
  - `src/app/login/actions.ts`
  - `src/app/login/page.tsx`
  - `src/app/todos/actions.ts`
  - `src/app/todos/page.tsx`
  - `src/app/page.tsx`
  - `package.json`
  - `bun.lock`
- 리스크:
  - 이메일 확인 정책이 켜진 Supabase 프로젝트에서는 로그인 타이밍에 따라 즉시 세션 생성이 안 될 수 있음

## Verification
- Commands:
  - `bun run lint`
  - `bun run typecheck`
- 결과 요약:
  - lint/typecheck 모두 통과

## Fix Log
- 이슈: `bun run typecheck`에서 Supabase client 생성자 타입 오류 발생
- 원인: env 값을 모듈 최상단에서 읽어 `string | undefined`로 추론됨, `setAll` 파라미터 타입 미명시
- 수정: env 검증을 함수 내부로 이동하고, 서버 쿠키 `setAll` 파라미터 타입을 명시
- 재검증: `bun run lint && bun run typecheck` 통과

## Handoff Pointer
- Write to: `/Users/nagi/Downloads/codex-test/.ai/sessions/<prefix>/<branch-number>--<slug-and-so-on>/handoff.md`
