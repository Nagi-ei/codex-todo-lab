---
name: thread-handoff-writer
description: Produce concise handoff logs between sessions/threads for branch-based development. Use when ending a work session, switching branches, or passing unfinished tasks to another agent/thread.
---

# Thread Handoff Writer

Write deterministic handoff notes so the next thread can resume without guessing.

## Branch/Session Convention
1. Branch format: `<prefix>/<branch-number>--<slug-and-so-on>`.
2. Allowed prefixes: `feature`, `ui`, `refactor`, `fix`.
3. Session name must be identical to branch name.

## Output Location
Write handoff to:
- `/Users/nagi/Downloads/codex-test/.ai/sessions/<prefix>/<branch-number>--<slug-and-so-on>/handoff.md`

Write rolling progress notes to:
- `/Users/nagi/Downloads/codex-test/.ai/sessions/<prefix>/<branch-number>--<slug-and-so-on>/log.md`

## Required Sections
1. Context: goal, branch, commit/working-tree status.
2. Completed: what is done and verified.
3. Pending: exact next tasks in order.
4. Risks/Decisions: blockers, assumptions, tradeoffs.
5. Verification: commands run and pass/fail summary.
6. Resume Command: one command/prompt that restarts work quickly.

## Handoff Template
```md
# Handoff

## Context
- Branch:
- Goal:
- Status:

## Completed
1.
2.

## Pending (ordered)
1.
2.

## Risks / Decisions
- 

## Verification
- Commands:
- Result:

## Resume
- Next prompt: "Read /Users/nagi/Downloads/codex-test/.ai/master-plan.md and this handoff, then continue Pending #1"
```

## Rules
1. Do not write narrative history; write actionable next steps.
2. Keep pending items atomic and testable.
3. Include file paths for any partially completed work.
4. If blocked, state the exact missing input/permission.
