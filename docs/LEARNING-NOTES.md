# 학습 노트

## 목적

이 문서는 이 프로젝트를 진행하면서 실제로 무엇을 학습했는지, 현재 구조가 왜 이렇게 정리됐는지, 다음 세션이 어디서 재진입해야 하는지를 빠르게 파악하기 위한 기록이다.

## 한 줄 요약

이 프로젝트에서 학습한 핵심은 `Todo 앱 구현` 자체보다, 작은 기능을 TDD와 브랜치 사이클로 밀고 가면서 `Supabase 사용`, `테스트 설계`, `구조 규칙`, `스킬 기반 구현 유도`를 반복적으로 다듬는 과정이었다.

## 현재 구조 요약

- `src/app`은 route entry 전용이다.
- 읽기 흐름은 Server Component와 feature service가 담당한다.
- 쓰기 흐름은 `src/features/<domain>/actions/*`의 Server Action이 담당한다.
- 클라이언트 쪽 mutation orchestration은 `src/features/<domain>/hooks/*`로 분리한다.
- `src/components`는 UI 조합과 렌더링에 집중한다.
- `src/lib`는 Supabase client 같은 전역 통합 코드만 둔다.

이 구조는 branch 05에서 확정됐다. branch 06은 이 구조를 문서에 반영하고, 이 구조가 왜 나왔는지 학습 관점에서 정리하는 역할이다.

## 1. TDD와 테스트에서 학습한 것

### 1-1. TDD는 테스트를 먼저 많이 쓰는 것이 아니라 slice를 작게 자르는 일에 가깝다

- RED, GREEN, REFACTOR를 한 번에 크게 돌리기보다 작은 goal 단위로 쪼개는 습관이 중요했다.
- 실제로는 "기능 하나"보다 더 작은 "경계 하나", "실패 경로 하나", "문서 drift 하나"를 기준으로 slice를 나누는 쪽이 효과적이었다.
- 특히 branch 02, 05에서는 문제가 발견될 때마다 재계획하고 가장 이른 slice로 되돌아가는 흐름이 학습 포인트였다.

### 1-2. 테스트는 구현 세부보다 공개 동작을 고정해야 오래 간다

- Todo action 테스트는 내부 함수보다 공개 action entrypoint 기준으로 유지하는 쪽이 리팩터에 강했다.
- read error, filter, presentation 같은 테스트도 "도메인에서 어떤 결과를 보여줘야 하는가"를 고정하는 방향이 더 유효했다.
- 인증/투두 흐름에서는 unit test만으로 부족하고 smoke E2E가 최소한의 회귀망 역할을 해줬다.

### 1-3. 실패 경로를 명시적으로 드러내는 테스트가 중요했다

- `/todos` read 실패를 빈 상태로 숨기지 않고 에러 패널로 표면화한 변경은, 단순 UI 수정이 아니라 실패를 테스트 가능한 상태로 만든 작업이었다.
- auth flow에서도 wrong-password, signup 후 분기, 토스트 에러 계약 같은 부분을 실패 시나리오 기준으로 다듬었다.
- "행복 경로가 된다"보다 "실패가 어떤 형태로 드러나야 하는가"를 고정하는 학습이 있었다.

### 1-4. smoke test는 작은 프로젝트에서도 품질 게이트 역할을 한다

- Playwright smoke를 auth 전용으로 두는 것과 auth + todos 핵심 플로우를 같이 묶는 것의 차이를 경험했다.
- 결국 `bun run verify`에 핵심 플로우가 직접 포함되도록 만드는 것이 운영 감각에 더 가깝다는 점을 학습했다.
- 다만 Supabase 환경 의존성이 생기면 smoke가 flaky해질 수 있다는 리스크도 같이 확인했다.

## 2. Supabase 사용에서 학습한 것

### 2-1. Supabase는 "SDK 연결"보다 경계 설계와 운영 검증이 중요하다

- 브라우저/서버 환경에서 어떤 client를 써야 하는지 나누는 기본기를 익혔다.
- 인증, 보호 라우트, 서버 액션, RLS를 같이 맞춰야 사용자별 데이터 격리가 완성된다는 점을 확인했다.
- 단순히 CRUD가 동작하는 것과 "사용자 간 데이터가 실제로 안 섞이는 것"은 다른 검증 단계였다.

### 2-2. migration은 SQL 파일 작성만으로 끝나지 않는다

- `supabase/migrations/`에 파일을 두는 것만이 아니라, 어떻게 적용하고 어떤 순서로 검증할지 runbook이 필요했다.
- branch 02에서 migration 문서를 CLI 우선 흐름으로 정렬한 것은 Supabase 사용 학습의 일부였다.
- Dashboard SQL Editor는 fallback일 뿐 기본 경로가 아니라는 점도 정리됐다.

### 2-3. RLS는 정책 작성보다 실제 A/B 검증이 핵심이다

- user A/B를 분리해서 insert/read/update/delete/mismatched insert를 직접 검증한 경험이 중요했다.
- "정책 SQL이 맞아 보인다"와 "실환경에서 실제로 막힌다"는 다른 수준의 확신이라는 점을 배웠다.
- branch 03은 바로 그 운영 검증을 별도 브랜치로 떼어 증적까지 남기는 연습이었다.

### 2-4. 서버 전용 키와 로컬 테스트 편의 옵션도 분리해서 생각해야 한다

- `SUPABASE_SECRET_KEY`는 서버 전용 helper에서만 다뤄야 한다.
- `SUPABASE_AUTO_CONFIRM_EMAILS` 같은 편의 플래그는 로컬 테스트와 E2E를 부드럽게 만들지만, 운영 동작과 섞이면 안 된다.
- 결국 Supabase 사용 학습은 API 호출법보다도 "어떤 키와 설정을 어느 경계에서 써야 하는가"에 가까웠다.

## 3. 스킬/규칙 설계 연습에서 학습한 것

### 3-1. Server Action 경계 자체보다 "그 경계를 어떻게 유도할 것인가"를 연습했다

- branch 05에서 다룬 Server Action boundary 논의는, 단순히 Next.js 구조를 배운 것이라기보다 원하는 구조를 스킬과 규칙으로 밀어 넣는 연습에 가까웠다.
- `src/app` route entry only, feature-local actions, UI mutation hooks 같은 기준은 구현하면서 동시에 문서와 스킬에 반영됐다.
- 중요한 건 "좋아 보이는 구조를 말로 설명하는 것"이 아니라, 실제 작업 중 드리프트가 생겼을 때 다시 그 기준으로 돌아오게 만드는 장치였다.

### 3-2. 규칙은 처음부터 완벽하지 않고, 리뷰와 replan으로 다듬어야 한다

- 초기에 thin wrapper, route-level actions, repository layer 같은 구조가 잠시 생겼다가 다시 제거됐다.
- 이 과정에서 확인한 건 규칙이 한 번에 맞지 않아도, review와 replan을 통해 점진적으로 날카롭게 만들 수 있다는 점이다.
- `AGENTS.md`, `SCAFFOLD_STRUCTURE.md`, skill routing, branch artifacts가 함께 움직여야 규칙이 실제 구현을 밀어준다.

### 3-3. 문서도 아키텍처의 일부다

- 코드만 정리해도 README와 운영 문서가 따라오지 않으면 다음 세션이 잘못된 기준으로 재진입할 수 있다.
- 그래서 branch 06은 문서 정리 브랜치이지만 단순 마감 작업이 아니라, 앞선 브랜치에서 얻은 학습과 구조를 정본 문서에 반영하는 작업이다.
- 이와 별개로 master plan에는 없었지만 `codex/docs-agents` 브랜치에서 `AGENTS.md`, `SCAFFOLD_STRUCTURE.md`, 세션 artifact 구조를 먼저 정리한 작업이 있었고, 이 문서 인프라가 이후 브랜치들의 구현 방향을 실질적으로 규정했다.

## 4. 브랜치별로 남은 학습 흔적

### branch 01: `feature/01--supabase-auth-and-route-guard`

- Supabase Auth 연결
- 보호 라우트 기본기
- auth action 결과 계약
- toast 기반 에러 피드백
- Playwright smoke 도입
- TanStack Query provider 도입

### branch X: `codex/docs-agents`

- master plan에 없는 문서/프로세스 보강 브랜치
- `AGENTS.md` 정리
- `SCAFFOLD_STRUCTURE.md` 추가 및 정본화
- `plan.md + plans/*.md + log.md + handoff.md` 세션 artifact 구조 정착
- skill routing과 문서 책임 분리 정리
- 이후 브랜치들이 같은 구조 원칙과 작업 기록 방식을 따르도록 기반 마련

### branch 02: `feature/02--todo-domain-and-server-actions`

- Todo 도메인 타입/스키마
- CRUD/필터 구현
- unit test와 smoke test 결합
- read failure surface
- migration SQL, RLS 정책, runbook 정리

### branch 03: `feature/03--supabase-rls-and-security-hardening`

- 운영 검증 브랜치 축소
- A/B 사용자 격리 검증
- 증적 포맷 정의
- 문서와 실환경 검증 결과 맞추기

### branch 05: `refactor/05--frontend-architecture-alignment`

- route entry와 feature 경계 재정렬
- auth/todo 책임 분리
- read path 분리
- feature-local Server Action 구조화
- UI mutation hook 도입
- low-value wrapper와 indirection 제거

## 5. 현재 기준에서 유지해야 할 원칙

- `src/app` 아래에 도메인 helper나 action wrapper를 다시 넣지 않는다.
- 읽기와 쓰기 경계를 분리한다.
- component 안에서 `useMutation`, `router.refresh()`, toast orchestration을 반복하지 않는다.
- 테스트는 공개 동작과 실패 경로를 고정하는 방향으로 유지한다.
- Supabase 문서는 코드와 같이 갱신한다.
- 구조 변경이 생기면 문서와 skill routing도 같이 갱신한다.

## 6. 다음 세션 재진입 가이드

다음 세션에서 먼저 볼 문서:

1. `docs/MASTER-PLAN.md`
2. `docs/BRANCH-DEVELOPMENT-PLAN.md`
3. `SCAFFOLD_STRUCTURE.md`
4. 이 문서
5. 필요하면 branch 05 handoff와 branch 06 session artifacts

다음 세션에서 먼저 확인할 것:

1. 현재 작업 브랜치와 `plan.md`
2. 문서 설명과 실제 코드 구조가 여전히 맞는지
3. `bun run verify`가 통과하는지

## 7. 남아 있는 리스크

- 작은 프로젝트라 해도 E2E는 Supabase 환경 상태에 영향을 받을 수 있다.
- 문서가 최신이 아니면 이전 구조를 기준으로 다시 코드를 꼬이게 만들 수 있다.
- skill과 규칙은 강한 가이드지만, 구현 중 드리프트를 완전히 자동으로 막아주지는 못한다. 결국 review와 replan이 필요하다.
