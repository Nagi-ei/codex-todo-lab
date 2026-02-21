# Session Log

## used_skills
- `tdd-thread-flow`
- `git-commit-gitmoji`
- `branch-slice-execution-gate`
- `skill-creator`
- `frontend-ui-global`
- `e2e-smoke-gate`
- `playwright`

## TDD Cycle 1
- RED: `/todos` 비인증 접근 시 차단 실패 시나리오 정의 / 현재 보호 라우트가 없어 접근 차단 불가
- GREEN: Supabase env/client/server 유틸과 `/login`, `/todos`(가드+로그아웃) 구현 / `bun run lint` 통과
- REFACTOR: env 타입 안정화 및 서버 쿠키 타입 명시 / `bun run lint && bun run typecheck` 통과

## TDD Cycle 2 (Skill Integration)
- RED: 브랜치 작업이 큰 단위로 진행되어 원인 추적/검증 누락 위험 존재 / 슬라이스 강제 스킬 부재
- GREEN: 전역 스킬 `branch-slice-execution-gate` 생성, hard gate와 템플릿 정의
- REFACTOR: 현재 브랜치 thread에 9-slice 실행 계획 반영, E2E smoke 분리

## Skill Validation
- Dry run: 슬라이스가 9개로 분해되는 계획을 `thread.md`에 반영함 (5개 이상 충족)
- Gate check: 스킬에 hard-stop 조건(검증 미실행/로그 미기록/혼합 커밋) 명시
- Commit check: `:gitmoji: type: summary` 커밋 계약 명시
- Artifact check: slice/TDD/fix/commit checklist 템플릿 4종 포함

## Slice 1
- Goal: Auth 액션 상태 타입을 정의하고 RED 시나리오를 고정한다.
- Done criteria:
  - `AuthActionState`/`AuthErrorCode` 타입이 추가된다.
  - 로그인/회원가입 실패 시나리오를 RED로 기록한다.
- Verification:
  - `bun run typecheck`

## TDD Cycle (Slice 1)
- RED: 현재 액션은 실패를 모두 redirect 처리해 원인 추적이 어렵다 / 상태 타입 부재로 인라인 에러 관리 불가
- GREEN: `src/app/login/types.ts`에 상태/에러코드/초기상태 정의
- REFACTOR: 없음 / Slice 2에서 액션 전환과 함께 진행

## Slice 2
- Goal: 로그인 액션을 redirect 실패 흐름에서 상태 반환 흐름으로 전환한다.
- Done criteria:
  - `loginAction` 실패 시 `AuthActionState`를 반환한다.
  - 성공 시에만 `/todos`로 redirect 한다.
- Verification:
  - `bun run typecheck`

## TDD Cycle (Slice 2)
- RED: 로그인 실패 원인이 쿼리 리다이렉트로만 전달되어 네트워크 303 외에 관측 정보가 없다
- GREEN: `loginAction`을 상태 반환 기반으로 전환하고 성공만 redirect 유지
- REFACTOR: 과도기 호환을 위해 단일/이중 인자 처리 추가 (Slice 5에서 UI 연결 예정)

## Fix Log (Slice 2)
- Issue: `formAction` 타입이 `Promise<void>`만 허용해 `loginAction` 직접 연결 시 typecheck 실패
- Cause: 상태 반환형 액션을 기존 서버 컴포넌트 버튼 `formAction`에 바로 연결
- Fix: `loginActionRedirect(formData)` 어댑터를 추가해 현재 페이지는 void 액션을 사용
- Re-verify: `bun run typecheck`

## Slice 3
- Goal: 회원가입 액션을 상태 반환 기반으로 전환하고 성공 흐름을 분기한다.
- Done criteria:
  - `signupAction` 실패 시 상태를 반환한다.
  - 회원가입 성공 시 세션 유무에 따라 `/todos` 또는 `/auth/check-email`로 이동한다.
  - `/auth/check-email` 안내 페이지를 제공한다.
- Verification:
  - `bun run typecheck`

## TDD Cycle (Slice 3)
- RED: 회원가입 성공/실패가 모두 303 리다이렉트로만 보여 원인/상태 구분이 어렵다
- GREEN: `signupActionState` 추가, `signupAction`은 과도기 redirect 어댑터로 유지, `/auth/check-email` 라우트 추가
- REFACTOR: 오류 코드 맵(`unknown`, `invalid_credentials`) 보강

## Slice 4
- Goal: 인증 화면에 shadcn Tabs 골격을 도입한다.
- Done criteria:
  - `tabs` UI 컴포넌트가 추가된다.
  - 로그인 페이지에 로그인/회원가입 탭 구조가 렌더링된다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 4)
- RED: 로그인/회원가입 흐름이 한 폼에 결합되어 있어 사용자 흐름 분리가 약하다
- GREEN: `Tabs` 컴포넌트와 `AuthTabs` 골격을 추가하고 `/login`에 탭을 배치
- REFACTOR: 실제 폼 분리는 Slice 5/6로 분리해 변경 범위를 유지

## Slice 5
- Goal: 로그인 폼을 별도 컴포넌트로 분리하고 상태 기반 에러를 UI에 연결한다.
- Done criteria:
  - `LoginForm` 컴포넌트가 추가된다.
  - 로그인 탭이 `useActionState` 기반 인라인 에러를 표시한다.
  - 로그인 액션이 strict 시그니처(`prevState, formData`)로 사용된다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 5)
- RED: 로그인 실패 시 사용자가 페이지 내 원인 메시지를 즉시 확인할 수 없다
- GREEN: `LoginForm`을 client component로 분리하고 `loginActionState`를 연결
- REFACTOR: 페이지에서 공용 단일 폼 제거, 탭 내부 로그인/회원가입 흐름 분리 시작

## Fix Log (Slice 5)
- Issue: `signupActionState`가 제거된 `resolveArgs` 참조로 typecheck 실패
- Cause: login action 시그니처 리팩터 중 signup 쪽 종속 코드 정리를 누락
- Fix: `signupActionState(prevState, formData)` strict 시그니처로 정리
- Re-verify: `bun run lint && bun run typecheck`

## Slice 6
- Goal: 회원가입 폼을 별도 컴포넌트로 분리하고 toast 보조 피드백을 연결한다.
- Done criteria:
  - `SignupForm` 컴포넌트가 추가된다.
  - 회원가입 탭이 상태 기반 인라인 에러를 표시한다.
  - 실패 시 toast 에러가 보조로 노출된다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 6)
- RED: 회원가입 실패 원인이 탭 컨텍스트에서 명확하게 고정되지 않는다
- GREEN: `SignupForm` 분리, `useActionState(signupActionState)` 연결, 실패 시 인라인 + toast 노출
- REFACTOR: 레이아웃에 `Toaster`를 마운트해 전역 toast 채널 활성화

## Slice 7
- Goal: 액션/문구를 리팩터링하고 쿼리파라미터 기반 오류 흐름을 제거한다.
- Done criteria:
  - 로그인/회원가입 액션에 에러 매핑 함수가 적용된다.
  - `/login`이 `searchParams` 기반 오류 렌더링 없이 동작한다.
  - lint/typecheck가 통과한다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 7)
- RED: 쿼리파라미터 에러 표시는 303 리다이렉트 의존도가 높고 탭 기반 UX와 충돌한다
- GREEN: `toLoginErrorState`/`toSignupErrorState`를 추가해 액션 내 에러 매핑을 고정
- REFACTOR: `/login`에서 query error 렌더링 제거, 인라인 상태 렌더링 경로만 유지

## Fix Log (Slice 7)
- Issue: `signupAction` 래퍼가 제거된 초기 상태 상수를 참조해 typecheck 실패
- Cause: 상태 기반 폼 전환 후 남은 과도기 래퍼 정리 누락
- Fix: 더 이상 사용하지 않는 `signupAction` 리다이렉트 래퍼 제거
- Re-verify: `bun run lint && bun run typecheck`

## Slice 8
- Goal: Auth E2E smoke를 위한 Playwright 인프라를 추가한다.
- Done criteria:
  - `@playwright/test`가 dev dependency로 설치된다.
  - `playwright.config.ts`가 추가된다.
  - 로컬 웹서버 기반 실행 설정이 고정된다.
- Verification:
  - `bun run typecheck`
  - `bun run lint`

## TDD Cycle (Slice 8)
- RED: E2E 스크립트는 package.json에 있으나 설정/프레임워크 파일 부재로 실행 불가
- GREEN: `@playwright/test` 설치 및 `playwright.config.ts` 생성
- REFACTOR: 테스트 기준 URL/포트와 webServer 동작을 명시적으로 고정

## Slice 9
- Goal: 회원가입 -> 로그인 -> `/todos` 진입 E2E smoke를 구현하고 통과시킨다.
- Done criteria:
  - `tests/e2e/auth.smoke.spec.ts`가 추가된다.
  - `bun run test:e2e:smoke`에서 auth smoke가 통과한다.
- Verification:
  - `bun run test:e2e:smoke`

## TDD Cycle (Slice 9)
- RED: 신규 가입 계정으로 즉시 로그인 시 `/login`에 머물며 E2E 실패
- GREEN: auth smoke 스펙 추가 및 자동 확인 메일 환경 분기(`SUPABASE_AUTO_CONFIRM_EMAILS=true`) 적용
- REFACTOR: auto-confirm 로직을 `supabase/admin` 유틸로 분리

## Fix Log (Slice 9)
- Issue: E2E에서 로그인 후 `/todos` 진입 실패(계속 `/login`)
- Cause: 프로젝트 이메일 확인 정책으로 가입 직후 로그인 불가
- Fix: 테스트 실행 시 자동 이메일 확인 분기 추가 후 재로그인
- Re-verify: `bun run test:e2e:smoke`

## Slice 10
- Goal: 인증 진입 경로를 `/auth`로 전환하고 페이지 UI 문구/하단 링크를 개선한다.
- Done criteria:
  - 인증 진입 주소가 `/auth`로 동작하고 `/login`은 호환 리다이렉트된다.
  - 제목이 로그인 전용 문구가 아닌 인증 문구로 변경된다.
  - 하단 홈 링크가 오른쪽 하단 버튼 형태로 표시된다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`
  - `bun run test:e2e:smoke`

## TDD Cycle (Slice 10)
- RED: 인증 페이지 주소(`/login`)와 제목/하단 링크 UI가 현재 요구와 불일치
- GREEN: `/app/auth/page.tsx` 도입, `/app/login/page.tsx`는 `/auth` 리다이렉트, 관련 링크/리다이렉트/E2E 경로 일괄 전환
- REFACTOR: 기존 `/app/login/actions.ts`, `/app/login/types.ts` 제거 후 `/app/auth/*`로 참조 정리

## Slice 11
- Goal: `branch-slice-execution-gate` 스킬에 하드닝 단계 강제를 추가하고 `$` 노출 메타데이터를 보완한다.
- Done criteria:
  - 스킬에 happy-path 이후 hardening slice 필수 규칙이 추가된다.
  - `agents/openai.yaml`이 생성된다.
  - `$` 노출 누락 원인을 문서화한다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 11)
- RED: 동작 흐름 구현 후 완성도 향상 단계가 스킬에 명시적으로 강제되지 않음
- GREEN: SKILL.md에 hardening gate/hard-stop/template를 추가하고 `agents/openai.yaml` 생성
- REFACTOR: `$` 노출 경로(agents metadata) 기준에 맞게 전역 스킬 구조 정리

## Slice 12A
- Goal: Auth 에러 계약을 고정하고 개발자 관측 필드를 포함한다.
- Done criteria:
  - `AuthActionState`에 `debug_reason` 필드가 추가된다.
  - login/signup 에러 매핑이 코드 중심으로 정규화된다.
- Verification:
  - `bun run typecheck`

## TDD Cycle (Slice 12A)
- RED: raw provider message/형식이 UI와 디버깅 목적에 일관되지 않음
- GREEN: `debug_reason` 추가 및 액션 에러 매핑 표준화
- REFACTOR: 사용자 메시지는 일반화하고 디버깅 정보는 분리

## Slice 12B
- Goal: 로그인 폼을 toast-only 에러 처리로 전환한다.
- Done criteria:
  - 로그인 인라인 에러가 제거된다.
  - 로그인 실패 시 toast만 노출된다.
  - 개발 모드에서 code/debug_reason 로그가 남는다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 12B)
- RED: 로그인 실패 메시지가 인라인으로 표시되어 toast 정책과 불일치
- GREEN: `LoginForm`을 `toast.error` 기반으로 전환
- REFACTOR: 중복 토스트 방지 키를 적용

## Slice 12C
- Goal: 회원가입 폼 에러 정책을 login과 동일하게 통일한다.
- Done criteria:
  - 회원가입 인라인 에러가 제거된다.
  - 회원가입 실패 시 toast-only 정책이 적용된다.
- Verification:
  - `bun run lint`
  - `bun run typecheck`

## TDD Cycle (Slice 12C)
- RED: signup은 toast+inline 혼합, login은 정책 불일치
- GREEN: `SignupForm` 인라인 제거 및 toast-only 통일
- REFACTOR: login과 동일한 디버그 로그/중복 방지 처리 적용

## Slice 12D (Hardening)
- Goal: wrong-password 실패 시나리오를 E2E로 고정한다.
- Done criteria:
  - `@smoke` 실패 케이스(틀린 비밀번호)가 추가된다.
  - 실패 시 toast 메시지 표시를 검증한다.
- Verification:
  - `bun run test:e2e:smoke`

## TDD Cycle (Slice 12D)
- RED: 실패 경로가 smoke suite에서 보장되지 않음
- GREEN: wrong-password smoke 테스트 추가
- REFACTOR: 가입/로그아웃/오입력 로그인 흐름을 재사용해 안정화
