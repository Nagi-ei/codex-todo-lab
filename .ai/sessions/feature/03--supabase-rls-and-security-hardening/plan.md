# Branch Plan

- Primary classification: `supabase-rls`
- Secondary classification: none
- Primary skill lens: `supabase-rls-guard`
- Secondary skill lens: `branch-cycle-orchestrator`

## Meta

- Session Name: `feature/03--supabase-rls-and-security-hardening`
- Git Branch: `codex/feature/03--supabase-rls-and-security-hardening`
- Date: `2026-03-08`
- Owner: `Codex`
- Current Cycle: `01-branch-baseline`
- Plan Snapshot: `plans/01-branch-baseline.md`

## Scope

- In:
  - existing `todos` RLS SQL and runbook baseline re-check
  - user A/B manual validation for read/insert/update/delete isolation
  - evidence capture in session log and operational docs
  - explicit stop/replan if policy behavior diverges from expected ownership model
- Out:
  - new product features
  - UI redesign
  - broad test harness work already absorbed by branch 02
  - schema or policy redesign unless validation finds a concrete defect

## Interface / Type Changes

- No public interface or type changes are planned at baseline.
- If manual validation exposes an RLS defect, reopen Planner before changing SQL or app behavior.

## Slice 1

- Goal: validation baseline and evidence format을 고정한다.
- Binding skill lens: `supabase-rls-guard`
- Done criteria:
  - target table, ownership predicate, required scenarios가 명시된다.
  - evidence를 남길 위치와 필수 항목(일시, 환경, 계정 역할, 기대/실제 결과)이 고정된다.
  - current branch docs replan 상태가 03 운영 검증 브랜치와 모순되지 않는다.
- Out of scope:
  - 실제 A/B 실행
  - SQL 수정
- Planned files:
  - `docs/BRANCH-DEVELOPMENT-PLAN.md`
  - `docs/MASTER-PLAN.md`
  - `supabase/README.md`
  - `.ai/sessions/feature/03--supabase-rls-and-security-hardening/log.md`
- RED:
  - current docs only state the checklist at a high level and do not define a structured evidence record for branch completion.
- GREEN:
  - align canonical docs and runbook with an explicit branch-03 validation baseline and evidence capture format.
- REFACTOR:
  - remove duplicated wording so branch plan, master plan, and runbook use the same ownership-validation terms.
- Verify:
  - `rg -n "운영 검증|A/B|evidence|검증" docs/BRANCH-DEVELOPMENT-PLAN.md docs/MASTER-PLAN.md supabase/README.md .ai/sessions/feature/03--supabase-rls-and-security-hardening/log.md`
- Failure recovery:
  - if docs disagree on scope or completion criteria, stop execution and re-baseline the plan before any environment validation.
- Commit:
  - `📝 docs: align branch 03 as operational rls validation`

## Slice 2

- Goal: user A/B manual validation을 실행하고 증적을 남긴다.
- Binding skill lens: `supabase-rls-guard`
- Done criteria:
  - user A own-row create succeeds.
  - user B cannot read user A rows.
  - user B cannot update or delete user A rows.
  - mismatched `user_id` insert is blocked.
  - each scenario records environment, actor, expected result, actual result, and evidence note.
- Out of scope:
  - policy redesign without observed failure
  - automated RLS test harness creation
- Planned files:
  - `.ai/sessions/feature/03--supabase-rls-and-security-hardening/log.md`
  - `.ai/sessions/feature/03--supabase-rls-and-security-hardening/handoff.md`
  - `supabase/README.md`
- RED:
  - branch 03 cannot be closed because actual A/B isolation evidence is missing.
- GREEN:
  - execute the checklist against the linked Supabase project and record the observed outcomes.
- REFACTOR:
  - compress the evidence into a reusable runbook section or concise validation summary for future sessions.
- Verify:
  - manual validation checklist complete
  - `bun run test:e2e:smoke`
- Failure recovery:
  - if any scenario fails, capture the exact failing operation and return to Planner with the defect before patching code or SQL.
- Commit:
  - `🔒 fix: record rls isolation validation evidence`

## Slice 3

- Goal: branch closure artifacts를 정리한다.
- Binding skill lens: `supabase-rls-guard`
- Done criteria:
  - handoff states whether branch 03 is complete or blocked.
  - remaining risks and any unresolved environment assumptions are explicit.
  - final verify evidence is linked from the session artifacts.
- Out of scope:
  - unrelated docs cleanup
  - release notes for other branches
- Planned files:
  - `.ai/sessions/feature/03--supabase-rls-and-security-hardening/handoff.md`
  - `.ai/sessions/feature/03--supabase-rls-and-security-hardening/log.md`
- RED:
  - without closure artifacts the branch state is not reusable by the next session.
- GREEN:
  - write handoff and completion summary from the validated evidence.
- REFACTOR:
  - trim the handoff to current state, remaining issues, and next action only.
- Verify:
  - `test -f .ai/sessions/feature/03--supabase-rls-and-security-hardening/handoff.md`
  - `test -f .ai/sessions/feature/03--supabase-rls-and-security-hardening/log.md`
- Failure recovery:
  - if branch state remains ambiguous, reopen the relevant earlier slice instead of closing with vague notes.
- Commit:
  - `🧹 chore: finalize branch 03 handoff`

## Final Stages

- Hardening:
  - re-check `todos` ownership model, update `using + with check`, service-role exposure boundaries, and app-side error handling against `supabase-rls-guard`.
- Review:
  - run `pr-review-check` with the primary lens focused on false-positive isolation, missing failure evidence, and drift between docs and actual validation.
- Refactor:
  - apply only fixes justified by validation or review findings; otherwise keep this branch documentation-first.
- Final Verify:
  - `bun run verify`
  - manual A/B validation record complete in session log
