# PRD - Learning Todo App

## 1. Product Summary
학습 목적의 Todo 앱을 구현한다. 목표는 사용자 인증, 사용자별 데이터 격리, 기본 생산성 UX, 테스트 자동화를 모두 경험하는 것이다.

## 2. Target Users
1. Codex 기반 개발 워크플로우를 학습하는 개인 개발자
2. Next.js + Supabase 기반 실무형 최소 아키텍처를 연습하려는 사용자

## 3. Goals
1. 이메일 인증 기반 사용자별 Todo 관리
2. 직관적인 모바일 우선 UI
3. 기본 품질 게이트 자동화(typecheck/unit/e2e)

## 4. Non-Goals
1. OAuth 로그인
2. 협업/공유 기능
3. 배포 자동화(CI/CD)

## 5. Functional Requirements
1. 회원가입/로그인/로그아웃
2. Todo 생성/수정/삭제
3. 완료/미완료 토글
4. 전체/진행중/완료 필터
5. 빈 상태, 로딩 상태, 에러 상태 표시
6. 로그인 방식은 이메일+비밀번호를 사용한다.
7. Todo 수정은 모달(다이얼로그) 기반으로 수행한다.

## 6. Data & Security
1. Supabase `todos` 테이블 + RLS 적용
2. 사용자는 자신의 데이터만 읽기/쓰기 가능
3. 서버단 입력 검증(Zod)

## 7. UX Requirements
1. shadcn/ui 컴포넌트 우선 사용
2. Tailwind 유틸리티 기반 스타일
3. 접근성 기본 준수(라벨/키보드 포커스)

## 8. Tech Stack & Libraries
1. Next.js (App Router) + TypeScript
2. React
3. Bun (package manager/runtime)
4. Tailwind CSS
5. shadcn/ui
6. TanStack Query
7. Supabase (`@supabase/supabase-js`, auth helpers 계열)
8. Zod
9. Playwright
10. Vitest

## 9. Success Metrics
1. 핵심 사용자 플로우 E2E 통과율 100%
2. 사용자 간 데이터 격리 수동 검증 통과
3. 문서(README + learning notes) 최신화 유지

## 10. Decisions
1. 로그인 UX는 이메일+비밀번호 방식으로 확정한다.
2. Todo 수정 UX는 모달(다이얼로그) 방식으로 확정한다.
