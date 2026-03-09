# Branch Plan

- Primary classification: `next-app-router`
- Secondary classification: `react-ui`
- Primary skill lens: `frontend-architecture-rules`
- Secondary skill lens: `next-best-practices`

## Meta

- Session Name: `refactor/06--docs-and-learning-notes`
- Git Branch: `codex/refactor/06--docs-and-learning-notes`
- Date: `2026-03-10`
- Owner: `Codex`
- Current Cycle: `01-branch-baseline`
- Plan Snapshot: `plans/01-branch-baseline.md`

## Scope

- In:
  - rewrite `README.md` from the Next.js template to the actual project runbook
  - add a dedicated learning/re-entry note that explains the current feature boundaries and branch history through branch 05
  - align canonical docs and `.agent` session guidance where the current wording drifts from the direct Server Action plus feature-hook structure
  - keep branch 06 documentation focused on reproducible commands, current architecture, and next-session re-entry
- Out:
  - new product behavior or route changes
  - additional code refactors beyond the minimal proof needed to verify documentation accuracy
  - deployment/CI automation setup
  - reopening branch 05 structural work unless documentation review finds a concrete code/doc mismatch

## Interface / Type Changes

- No public runtime interface or type changes are planned.
- Planned documentation additions:
  - `README.md` becomes the product-specific setup, verification, and architecture entrypoint.
  - `docs/LEARNING-NOTES.md` is introduced as the canonical learning/re-entry note unless execution finds an existing file that should be reused instead.

## Decision Summary

- Keep:
  - `docs/MASTER-PLAN.md`, `docs/BRANCH-DEVELOPMENT-PLAN.md`, and `docs/PRD.md` as canonical product documents.
  - `SCAFFOLD_STRUCTURE.md` as the structural source of truth for route-entry-only `src/app`, feature-local Server Actions, and UI mutation hooks.
  - branch 05 handoff as the baseline record of the final direct-action plus feature-hook structure.
- Remove:
  - template README wording that no longer reflects this repository.
  - duplicated or stale wording that still implies route-level action files or older mutation boundaries.
- Add:
  - a real project README with setup, environment, verify, and structure guidance.
  - a learning note that captures branch history, key architecture decisions, and next-session re-entry context.

## Target Structure

```text
README.md
docs/
  PRD.md
  MASTER-PLAN.md
  BRANCH-DEVELOPMENT-PLAN.md
  LEARNING-NOTES.md
.agent/sessions/refactor/06--docs-and-learning-notes/
  plan.md
  plans/01-branch-baseline.md
  log.md
  handoff.md
```

## Documentation Rules For Cycle 1

1. `README.md` must describe the current Bun-based workflow and actual verify commands from `package.json`.
2. Architecture wording must match the post-branch-05 structure: `src/app` route entry only, feature-local Server Actions, feature-local UI mutation hooks, Server Component reads.
3. Canonical docs should stay concise and non-duplicative; README and learning notes should point back to canonical sources rather than fork them.
4. Learning notes must help a new session re-enter without rereading every historical log.
5. If documentation review exposes a real code/doc mismatch, stop and replan before mixing a code fix into the docs branch.

## Slice 1

- Goal: README baseline을 실제 프로젝트 실행/검증/구조 기준으로 재작성한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - `README.md` no longer contains template Next.js starter content.
  - setup prerequisites, env expectations, local run flow, and verify flow reflect `bun` scripts and current project conventions.
  - README architecture summary matches the current `src/app`, `src/features`, `src/components`, and `src/lib` responsibilities.
- Out of scope:
  - exhaustive Supabase operational runbook duplication
  - branch-history deep dive better suited to learning notes
- Planned files:
  - `README.md`
  - `package.json`
  - `SCAFFOLD_STRUCTURE.md`
- RED:
  - the current README is still generic template content and does not help a contributor run or understand the project.
- GREEN:
  - replace template sections with product-specific setup, scripts, route overview, and architecture guidance.
- REFACTOR:
  - keep the README compact by linking to canonical docs and the Supabase runbook instead of duplicating every detail.
- Verify:
  - `rg -n "Learning Todo App|bun run verify|src/features|Server Actions|TanStack Query" README.md`
- Failure recovery:
  - if a required command or path cannot be proven from the repo, stop and verify the source before documenting it.
- Commit:
  - `📝 docs: rewrite readme for current app workflow`

## Slice 2

- Goal: 학습 노트와 재진입 문서를 현재 기준선에 맞춰 추가한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - a dedicated learning note exists and explains the branch progression through branch 05.
  - the note captures the current mutation/read boundaries, session artifact workflow, and remaining known risks.
  - a new session can identify where to start without replaying old branch logs end to end.
- Out of scope:
  - duplicating every slice from historical logs
  - new architectural policy beyond what the canonical docs already define
- Planned files:
  - `docs/LEARNING-NOTES.md`
  - `.agent/sessions/refactor/05--frontend-architecture-alignment/handoff.md`
  - `docs/MASTER-PLAN.md`
  - `docs/BRANCH-DEVELOPMENT-PLAN.md`
- RED:
  - the repo currently promises learning notes in the PRD and master plan, but no canonical learning note exists.
- GREEN:
  - add a concise learning/re-entry note that summarizes what was built, why the current structure exists, and what future sessions should preserve.
- REFACTOR:
  - keep branch history compressed into milestone-level lessons and current-state decisions rather than replaying commit history.
- Verify:
  - `test -f docs/LEARNING-NOTES.md`
  - `rg -n "branch 05|Server Action|useMutation|known risks|re-entry" docs/LEARNING-NOTES.md`
- Failure recovery:
  - if the learning note starts restating full historical logs, cut back to current decisions, evidence, and next actions.
- Commit:
  - `📝 docs: add learning notes and re-entry guide`

## Slice 3

- Goal: canonical docs와 session artifacts를 정합성 기준으로 마감한다.
- Binding skill lens: `frontend-architecture-rules`
- Done criteria:
  - canonical docs, README, and learning notes do not contradict the current code structure.
  - planner/execution evidence for branch 06 is recorded in session artifacts.
  - full-project verify passes after docs updates.
- Out of scope:
  - unrelated docs cleanup outside the branch 06 scope
  - new code refactors to improve wording convenience
- Planned files:
  - `docs/MASTER-PLAN.md`
  - `docs/BRANCH-DEVELOPMENT-PLAN.md`
  - `.agent/sessions/refactor/06--docs-and-learning-notes/log.md`
  - `.agent/sessions/refactor/06--docs-and-learning-notes/handoff.md`
- RED:
  - until docs are cross-checked and final verify passes, branch 06 cannot prove that its written guidance is safe to follow.
- GREEN:
  - align any remaining wording drift, record verification evidence, and finalize handoff notes.
- REFACTOR:
  - trim session artifacts to current state, remaining risks, and next actions only.
- Verify:
  - `rg -n "refactor/06--docs-and-learning-notes|README|learning" docs/MASTER-PLAN.md docs/BRANCH-DEVELOPMENT-PLAN.md docs/PRD.md`
  - `bun run verify`
- Failure recovery:
  - if final verify fails, return to the earliest slice affected by the failing command or stale documentation claim.
- Commit:
  - `🧹 chore: finalize branch 06 docs alignment`

## Final Stages

- Hardening:
  - re-check every documented command, path, and architecture statement against the repository tree and `package.json`.
- Review:
  - run `pr-review-check` with focus on code/doc drift, missing re-entry context, and documentation that hides current architectural boundaries.
- Refactor:
  - apply only wording or artifact fixes justified by hardening/review findings.
- Final Verify:
  - `bun run verify`
