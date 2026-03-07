# SCAFFOLD_STRUCTURE.md

## Goal
- 역할별 폴더 구조를 강제해 새 코드가 일관된 위치에 배치되도록 한다.
- route, domain logic, shared UI, global util의 경계를 명확히 분리한다.

## Done Criteria
1. 새 파일을 만들 때 어느 폴더에 둬야 하는지 바로 판단할 수 있다.
2. `src/app`, `src/features`, `src/components`, `src/lib`의 책임이 겹치지 않는다.
3. 새 도메인 추가 시 기본 scaffold를 그대로 복사해 사용할 수 있다.

## Out of Scope
1. 기존 파일 전면 이동
2. 디자인 시스템 개편
3. 테스트 전략 문서화

## Canonical Structure

```text
src/
  app/
    <route>/
      page.tsx
      loading.tsx
      error.tsx
  features/
    <domain>/
      actions/
      components/
      hooks/
      services/
      schema/
      types/
      presentation/
  components/
    ui/
    <shared-domain>/
    providers/
  lib/
    utils/
    integrations/
    constants/
```

## Placement Rules
1. `src/app/*`에는 route entry만 둔다. `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`만 허용한다.
2. `src/app/*`에는 비즈니스 계산과 mutation entry를 넣지 않는다. 데이터 조합과 route 진입 orchestration만 담당한다.
3. `src/features/<domain>/*`는 해당 도메인의 기본 작업 공간이다. 새 기능은 여기부터 만든다.
4. `src/features/<domain>/actions/*`에는 domain 전용 Server Action을 둔다. `use server` 선언, 입력 검증, auth/authorization 확인, mutation 실행, 결과 반환을 담당한다.
5. `src/features/<domain>/components/*`에는 그 도메인 전용 UI를 둔다.
6. `src/features/<domain>/hooks/*`에는 컴포넌트에서 쓰는 도메인 hook만 둔다.
7. `src/features/<domain>/services/*`에는 여러 action에서 공유되는 서버 helper, read orchestration, domain service 함수를 둔다.
8. `src/features/<domain>/schema/*`에는 Zod schema, validator, form schema를 둔다.
9. `src/features/<domain>/types/*`에는 도메인 타입과 input/output 계약을 둔다.
10. `src/features/<domain>/presentation/*`에는 view model, formatter, selector, display mapper를 둔다.
11. `src/components/ui/*`에는 디자인 시스템 단위 컴포넌트만 둔다.
12. `src/components/<shared-domain>/*`에는 여러 route 또는 여러 feature에서 재사용되는 조합 UI만 둔다.
13. `src/components/providers/*`에는 app-level provider만 둔다.
14. `src/lib/*`에는 전역 util, framework adapter, 외부 SDK client를 둔다. 도메인 규칙은 두지 않는다.

## Do Not Place Here
1. `src/app/*` 아래에 domain helper, formatter, validator를 만들지 않는다.
2. `src/app/*` 아래에 feature 전용 Server Action 파일을 두지 않는다.
3. `src/lib/*` 아래에 특정 도메인 비즈니스 로직을 넣지 않는다.
4. `src/components/ui/*` 아래에 화면 전용 복합 컴포넌트를 넣지 않는다.
5. 한 도메인에서만 쓰는 코드를 `src/components/<shared-domain>`로 올리지 않는다.
6. 기능 구현 시작점을 `src/components`나 `src/lib`로 두지 않는다. 먼저 `src/features/<domain>`에 만든다.
7. UI component 안에 `useMutation` 설정, toast orchestration, `router.refresh()` 같은 서버 mutation 흐름을 직접 넣지 않는다.

## New Domain Scaffold

```text
src/features/<domain>/
  actions/
  components/
  hooks/
  services/
  schema/
  types/
  presentation/
```

## Server Action Policy
1. Server Action은 Next.js mutation boundary이지 route special file이 아니다.
2. 따라서 `src/app`에 두기보다 `src/features/<domain>/actions/*`에 두고 domain 경계와 함께 관리한다.
3. action file은 forwarding-only wrapper로 만들지 않는다. 별도 use-case layer가 실질적 가치를 줄 때만 action 아래에 한 단계를 더 둔다.
4. action file은 입력 검증, auth/authorization 확인, mutation 실행, 결과 반환까지 직접 담당할 수 있다.
5. DB access나 provider-specific write를 별도 service로 빼더라도, 그 분리는 query-chain wrapper 이상으로 명확한 책임을 설명할 수 있을 때만 유지한다.
6. 이 정책은 Next.js가 Server Action 위치를 `app`으로 강제하지 않고, Vercel 가이드가 action 내부 보안 검증을 강조한다는 점과 일치한다.

## UI Mutation Hook Policy
1. `useMutation`은 component 안에 반복 배치하지 말고 `src/features/<domain>/hooks/*`로 올린다.
2. hook은 toast, refresh, success/failure branching 같은 UI-facing mutation orchestration을 담당한다.
3. component는 render tree와 local UI state만 들고 hook이 제공하는 mutation contract를 사용한다.
4. hook은 숨은 service layer가 아니라 UI 경계여야 한다.

## Decision Order
1. route 진입 코드인가? 그러면 `src/app`
2. domain 전용 Server Action entry인가? 그러면 `src/features/<domain>/actions`
3. 특정 도메인 전용 코드인가? 그러면 `src/features/<domain>`
4. 여러 도메인/화면에서 재사용되는 UI 조합인가? 그러면 `src/components/<shared-domain>`
5. 디자인 시스템 primitive인가? 그러면 `src/components/ui`
6. 전역 util 또는 SDK 연결인가? 그러면 `src/lib`

## Review Checklist
1. 새 기능이 `src/features/<domain>`부터 시작했는가.
2. `page.tsx`가 조합 역할만 하고 있는가.
3. Server Action이 `src/app`이 아니라 `src/features/<domain>/actions`에 배치됐는가.
4. action file이 forwarding-only wrapper가 아니고 실제 server mutation boundary를 담당하는가.
5. domain logic이 `src/app`이나 `src/lib`로 새지 않았는가.
6. mutation UI orchestration이 component가 아니라 feature hook에 배치됐는가.
7. shared component로 올린 이유가 실제 재사용성으로 설명되는가.
8. 새 schema/type/service/hook의 위치가 역할과 맞는가.
