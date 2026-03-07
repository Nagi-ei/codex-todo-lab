# agents.md

## Goal
- Next.js App Router + React + TypeScript 기준으로 코드 일관성을 강제한다.
- 컴포넌트, 상태 관리, 서버 경계를 명확히 나눠 유지보수 비용을 낮춘다.

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
2. 컴포넌트 안에 비즈니스 로직을 직접 작성하지 않는다. 계산, 검증, 변환, 권한 분기, 서버 오케스트레이션은 `hook`, `service`, `schema`, `presentation` 계층으로 분리한다.
3. `page.tsx`는 라우트 진입점 역할만 맡는다. 데이터 로드, 권한 확인, 섹션 조합만 하고 비즈니스 계산은 넣지 않는다.
4. 공통 UI는 기존 디자인 시스템과 shadcn/ui를 우선 재사용한다. 새 UI를 만들기 전에 `src/components/ui`와 기존 조합 컴포넌트를 먼저 확인한다.
5. 새 유틸, helper, formatter를 만들기 전에 기존 `src/lib`와 도메인 유틸을 검색한다.
6. `any`는 금지한다. 불확실한 값은 `unknown`으로 받고 좁혀서 사용한다.
7. 클라이언트 컴포넌트에서 직접 API를 호출하지 않는다. 서버 액션, 전용 service, React Query mutation 경유만 허용한다.
8. 새 파일 배치와 역할별 폴더 구조는 [`SCAFFOLD_STRUCTURE.md`](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md)를 기준으로 따른다.

## React / Next.js Rules
1. 기본은 Server Component다. 브라우저 이벤트, 브라우저 API, client-only state가 필요할 때만 `"use client"`를 선언한다.
2. `"use client"`는 route 전체가 아니라 필요한 leaf 컴포넌트에만 둔다. 서버에서 끝낼 수 있는 로직을 클라이언트로 내리지 않는다.
3. `useEffect`는 외부 시스템 동기화에만 사용한다. 예: DOM API, subscription, timer, analytics, imperative bridge. 데이터 fetch, props-to-state 복사, 파생값 계산 용도로 쓰지 않는다.
4. 파생값은 렌더링 중 계산하거나 selector/helper로 분리한다. `useEffect` + `setState` 조합으로 만들지 않는다.
5. 폼은 `react-hook-form`을 기본으로 사용한다. 입력 검증은 가능하면 Zod 같은 스키마와 함께 둔다.
6. 서버 상태는 TanStack Query로 다룬다. UI 상태만 `useState`를 사용한다.
7. 읽기(R)는 Server Component에서 직접 가져온다. 불필요한 `useQuery`로 초기 데이터를 다시 요청하지 않는다.
8. 생성/수정/삭제(CUD)는 Server Action + `useMutation` 조합을 기본으로 한다. 성공 시 관련 query cache invalidation 또는 서버 리프레시 전략을 코드에 명시한다.
9. Route Handler는 기본 구현 수단이 아니다. 폼 액션, 사용자 상호작용, 내부 CRUD는 Server Action을 우선한다. 단, webhook, 외부 callback, 공개 API endpoint는 Route Handler를 허용한다.
10. 컴포넌트 파일은 UI 표현에 집중한다. 데이터 접근과 도메인 규칙은 상위 서버 계층 또는 전용 hook/service가 담당한다.

## State And Data Boundaries
1. 서버에서 가져온 데이터는 가능한 한 서버에서 정규화하고 클라이언트에는 화면에 필요한 shape만 전달한다.
2. 클라이언트에서 서버 데이터를 복제한 로컬 state를 만들지 않는다. 폼 draft, dialog open 여부, 탭 전환 같은 UI 상태만 로컬에 둔다.
3. mutation은 낙관적 업데이트 여부, 실패 처리, invalidate 대상 query key를 함께 설계한다.
4. 비밀키와 admin client는 서버 전용 파일에만 둔다. 클라이언트 번들로 흘러가면 안 된다.
5. Server Component에서 Client Component로 넘기는 props는 serializable 하고 최소여야 한다. 원본 응답 전체를 그대로 전달하지 않는다.
6. 서버에서 해결 가능한 정렬, 필터링, 권한 판정, 데이터 병합은 서버에서 끝내고 클라이언트에는 렌더링에 필요한 값만 전달한다.

## Structure Reference
1. 역할별 폴더 구조의 정본은 [`SCAFFOLD_STRUCTURE.md`](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md)다.
2. `AGENTS.md`는 아키텍처 원칙과 리뷰 기준을 정의하고, 실제 파일 배치 규칙은 `SCAFFOLD_STRUCTURE.md`를 따른다.
3. 새 기능은 항상 `SCAFFOLD_STRUCTURE.md`의 `Decision Order`와 `Placement Rules`를 먼저 확인하고 시작한다.

## Review Checklist
1. 컴포넌트가 200줄 이하인가.
2. 비즈니스 로직이 컴포넌트에서 분리되었는가.
3. `useEffect`가 외부 시스템 동기화 외 목적으로 쓰이지 않았는가.
4. 서버 상태와 UI 상태가 섞이지 않았는가.
5. 폼이 `react-hook-form` 기준으로 구성되었는가.
6. 직접 API 호출이나 `fetch`가 클라이언트 컴포넌트 안에 없는가.
7. `page.tsx`가 계산 로직 없이 조합 역할만 하는가.
8. 기존 UI/util 재사용 검토가 선행되었는가.
9. 타입 우회(`any`, 과도한 assertion)가 없는가.
10. `"use client"` 범위가 최소화되어 있는가.
11. 서버에서 클라이언트로 넘기는 데이터가 최소 shape인가.
12. mutation 이후 invalidate/refresh 전략이 분명한가.
13. 새 기능이 [`SCAFFOLD_STRUCTURE.md`](/Users/nagi/Downloads/codex-test/SCAFFOLD_STRUCTURE.md)의 구조 규칙을 따르는가.

## Default Decision
- 애매하면 Server Component 우선
- 애매하면 Server Action 우선
- 애매하면 기존 컴포넌트/유틸 재사용 우선
- 애매하면 작은 파일과 단일 책임 우선
