# Handoff

## Summary
- 루트 `agents.md`를 추가해 React/Next.js 개발 규칙을 문서화했다.
- 컴포넌트 길이 제한, 상태 관리, `useEffect`, `react-hook-form`, Server Action + TanStack Query, 역할별 폴더 구조 규칙을 포함했다.
- Route Handler는 기본 금지로 두되 webhook/public API 예외를 명시했다.
- 세션 문서 구조를 `plan.md + plans/*.md + log.md + handoff.md`로 정리하고, 전역 스킬/템플릿/브랜치 운영 문서에 반영했다.
- 루트에 `SCAFFOLD_STRUCTURE.md`를 추가해 역할별 폴더 구조와 새 도메인 scaffold 기준을 문서화했다.
- `AGENTS.md`의 구조 중복을 줄이고 `SCAFFOLD_STRUCTURE.md`를 구조 규칙의 정본으로 참조하도록 정리했다.
- `AGENTS.md`의 프론트엔드 상세 규칙과 리뷰 체크리스트 중복을 줄이고, 전용 스킬 참조 중심으로 재정리했다.

## Verification
- `bun run verify` 통과
- `test:unit`은 현재 매칭되는 테스트 파일이 없어 코드 0으로 종료

## Risks
- 현재 코드베이스는 아직 `src/features/<domain>` 구조로 정리되지 않았으므로 후속 기능 작업에서 점진 적용이 필요하다.
- 과거 세션 폴더에는 `thread.md` 기반 문서가 남아 있어 완전한 구조 통일은 아직 아니다.

## Used Skills
- `branch-planner`
- `tdd`
- `git-commit-gitmoji`
