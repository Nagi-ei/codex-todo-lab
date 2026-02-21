# Session Log

## used_skills
- `tdd-thread-flow`
- `git-commit-gitmoji`
- `branch-slice-execution-gate`
- `skill-creator`

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
