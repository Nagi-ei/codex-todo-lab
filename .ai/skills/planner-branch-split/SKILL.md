---
name: planner-branch-split
description: Split a product requirement into branch-sized implementation units with clear done criteria, verification commands, and handoff order. Use when starting a new feature, refining roadmap scope, or preparing branch execution plans.
---

# Planner Branch Split

Create implementation-ready branch plans from PRD or feature requests.

## Workflow
1. Read canonical docs (`docs/PRD.md`, `docs/MASTER-PLAN.md`).
2. Extract scope, constraints, and non-goals.
3. Split into branch units that each produce testable user value.
4. Define for each branch: goal, scope, done criteria, verification, risks.
5. Order branches by dependency.
6. Update branch plan doc and summarize decisions.

## Branch Quality Rules
1. One branch should fit in one focused review.
2. Prefer vertical slices (feature + required UI), not layer-only slices.
3. Keep out-of-scope items explicit.
4. Include rollback-safe checkpoints.

## Output Format
1. Branch name (`<prefix>/<number>--<slug>`)
2. Goal
3. Scope
4. Done criteria
5. Verification commands
6. Risks/assumptions
