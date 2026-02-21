# Session Log

## used_skills
- `tdd-thread-flow`
- `git-commit-gitmoji`

## TDD Cycle 1
- RED: `/todos` 비인증 접근 시 차단 실패 시나리오 정의 / 현재 보호 라우트가 없어 접근 차단 불가
- GREEN: Supabase env/client/server 유틸과 `/login`, `/todos`(가드+로그아웃) 구현 / `bun run lint` 통과
- REFACTOR: env 타입 안정화 및 서버 쿠키 타입 명시 / `bun run lint && bun run typecheck` 통과
