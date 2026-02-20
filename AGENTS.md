# AGENTS.md

## Working Agreement
1. 모든 작업은 `[계획 -> 구현 -> 검증 -> 수정]` 순서로 진행한다.
2. 구현 전에는 목표/완료조건/제외범위를 먼저 명시한다.
3. 구현 후에는 반드시 검증 명령을 실행하고 결과를 요약한다.
4. 실패 시 원인/수정사항/재검증 결과를 기록한다.
5. 새 작업 시작 시 `/Users/nagi/Downloads/codex-test/.ai/master-plan.md`, `/Users/nagi/Downloads/codex-test/docs/PRD.md`, 현재 브랜치 세션 폴더 로그를 먼저 읽는다.

## Scope Discipline
1. 플랜에 명시된 기능만 구현한다.
2. 계획된 범위를 넘어서는 추가 기능/리팩터링은 요청이 있을 때만 수행한다.
3. 구현은 항상 최소 단위(MVP)로 끝낸다.

## Component Rules
1. 한 파일에는 하나의 export 컴포넌트만 작성한다.
2. 반복 패턴이 생기면 보조 컴포넌트를 별도 파일로 분리한다.

## Branch & Session Policy
1. 브랜치 prefix는 `feature`, `ui`, `refactor`, `fix` 중 하나만 사용한다.
2. 브랜치 이름 형식은 `<prefix>/<branch-number>--<slug-and-so-on>`으로 고정한다.
3. 세션 이름은 브랜치 이름과 동일하게 사용한다.
4. 세션 폴더는 `/Users/nagi/Downloads/codex-test/.ai/sessions/<prefix>/<branch-number>--<slug-and-so-on>/`로 생성한다.
5. 새 작업 시작 시 `/Users/nagi/Downloads/codex-test/.ai/sessions/_template/thread.md`를 복사해 세션 폴더 안에 `thread.md`로 채운다.
6. 세션 진행 로그는 세션 폴더의 `log.md`에 누적한다.
7. handoff는 세션 폴더의 `handoff.md`에 기록한다.

## Quality Gates
1. PR 전 `npm run typecheck`, `npm run test:unit`, `npm run test:e2e:smoke`를 통과해야 한다.
2. 접근성 기본 체크(라벨, 키보드 포커스, 콘트라스트)를 수행한다.
3. 보안 규칙: 비밀키는 서버 전용, 클라이언트 노출 금지.

## UI Rules (shadcn/ui + Tailwind)
1. 기본 컴포넌트는 shadcn/ui를 우선 사용한다.
2. Tailwind 커스텀은 spacing/typography/state color 중심으로 제한한다.
3. 모바일 우선으로 구현하고 데스크톱 max-width 컨테이너를 적용한다.
