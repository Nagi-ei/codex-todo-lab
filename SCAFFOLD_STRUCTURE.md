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
      actions.ts
  features/
    <domain>/
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
1. `src/app/*`에는 route entry만 둔다. `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, route-level `actions.ts`만 허용한다.
2. `src/app/*`에는 비즈니스 계산을 넣지 않는다. 데이터 조합과 route 진입 orchestration만 담당한다.
3. `src/features/<domain>/*`는 해당 도메인의 기본 작업 공간이다. 새 기능은 여기부터 만든다.
4. `src/features/<domain>/components/*`에는 그 도메인 전용 UI를 둔다.
5. `src/features/<domain>/hooks/*`에는 컴포넌트에서 쓰는 도메인 hook만 둔다.
6. `src/features/<domain>/services/*`에는 서버 호출 오케스트레이션, mutation 연결, 도메인 서비스 함수를 둔다.
7. `src/features/<domain>/schema/*`에는 Zod schema, validator, form schema를 둔다.
8. `src/features/<domain>/types/*`에는 도메인 타입과 input/output 계약을 둔다.
9. `src/features/<domain>/presentation/*`에는 view model, formatter, selector, display mapper를 둔다.
10. `src/components/ui/*`에는 디자인 시스템 단위 컴포넌트만 둔다.
11. `src/components/<shared-domain>/*`에는 여러 route 또는 여러 feature에서 재사용되는 조합 UI만 둔다.
12. `src/components/providers/*`에는 app-level provider만 둔다.
13. `src/lib/*`에는 전역 util, framework adapter, 외부 SDK client를 둔다. 도메인 규칙은 두지 않는다.

## Do Not Place Here
1. `src/app/*` 아래에 domain helper, formatter, validator를 만들지 않는다.
2. `src/lib/*` 아래에 특정 도메인 비즈니스 로직을 넣지 않는다.
3. `src/components/ui/*` 아래에 화면 전용 복합 컴포넌트를 넣지 않는다.
4. 한 도메인에서만 쓰는 코드를 `src/components/<shared-domain>`로 올리지 않는다.
5. 기능 구현 시작점을 `src/components`나 `src/lib`로 두지 않는다. 먼저 `src/features/<domain>`에 만든다.

## New Domain Scaffold

```text
src/features/<domain>/
  components/
  hooks/
  services/
  schema/
  types/
  presentation/
```

## Decision Order
1. route 진입 코드인가? 그러면 `src/app`
2. 특정 도메인 전용 코드인가? 그러면 `src/features/<domain>`
3. 여러 도메인/화면에서 재사용되는 UI 조합인가? 그러면 `src/components/<shared-domain>`
4. 디자인 시스템 primitive인가? 그러면 `src/components/ui`
5. 전역 util 또는 SDK 연결인가? 그러면 `src/lib`

## Review Checklist
1. 새 기능이 `src/features/<domain>`부터 시작했는가.
2. `page.tsx`가 조합 역할만 하고 있는가.
3. domain logic이 `src/app`이나 `src/lib`로 새지 않았는가.
4. shared component로 올린 이유가 실제 재사용성으로 설명되는가.
5. 새 schema/type/service/hook의 위치가 역할과 맞는가.
