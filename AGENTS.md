# AGENTS.md

## Working Agreement
1. 모든 작업은 `[계획 -> 구현 -> 검증 -> 수정]` 순서로 진행한다.
2. 구현 전에는 목표/완료조건/제외범위를 먼저 명시한다.
3. 구현 후에는 반드시 검증 명령을 실행하고 결과를 요약한다.
4. 실패 시 원인/수정사항/재검증 결과를 기록한다.
5. 새 작업 시작 시 `/Users/nagi/Downloads/codex-test/docs/MASTER-PLAN.md`, `/Users/nagi/Downloads/codex-test/docs/PRD.md`, `/Users/nagi/Downloads/codex-test/docs/BRANCH-DEVELOPMENT-PLAN.md`, 현재 브랜치 세션 폴더 로그를 먼저 읽는다.
6. 매 작업에서 실제 사용한 스킬 이름을 요약에 명시한다.
7. 작업이 특정 스킬의 범위와 일치하면 반드시 해당 스킬을 사용한다.

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
8. `log.md`와 `handoff.md`에는 `used_skills` 섹션을 필수로 남긴다.

## Quality Gates
1. PR 전 `bun run verify`를 우선 실행한다.
2. 필요 시 `bun run typecheck`, `bun run test:unit`, `bun run test:e2e:smoke`를 개별 실행해 원인을 분리한다.
3. 접근성 기본 체크(라벨, 키보드 포커스, 콘트라스트)를 수행한다.
4. 보안 규칙: 비밀키는 서버 전용, 클라이언트 노출 금지.

## TDD Rules
1. 기능 구현 전 실패하는 테스트(또는 명시적인 검증 시나리오)를 먼저 정의한다.
2. 구현은 테스트를 통과시키는 최소 코드부터 작성한다.
3. 테스트 통과 후 리팩터링하고 동일 테스트를 재실행한다.
4. 세션 로그에 `red -> green -> refactor` 결과를 기록한다.

## Commit Rules
1. 브랜치에서 작은 단위 기능(UI, 기능, 테스트) 완료 시 즉시 커밋한다.
2. 커밋 메시지는 영어로 작성한다.
3. 커밋 메시지 형식은 `:gitmoji: type: summary`를 기본으로 사용한다.
4. `type`은 `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`만 사용한다.
5. 기본 매핑은 `feat->✨`, `fix->🐛`, `docs->📝`, `style->🎨`, `refactor->♻️`, `test->✅`, `chore->🔧`를 사용한다.
6. 변경 의도가 더 명확해지면 다른 gitmoji를 사용할 수 있다.
7. gitmoji를 바꿔도 `type`은 반드시 유지한다.
8. 예시: `✨ feat: add todo create action`, `✅ test: add auth smoke case`, `🚑️ fix: patch login redirect crash`.

## UI Rules (shadcn/ui + Tailwind)
1. 기본 컴포넌트는 shadcn/ui를 우선 사용한다.
2. Tailwind 커스텀은 spacing/typography/state color 중심으로 제한한다.
3. 모바일 우선으로 구현하고 데스크톱 max-width 컨테이너를 적용한다.
