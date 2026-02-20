---
name: frontend-ui-global
description: Implement or refactor frontend UI with accessible, responsive patterns. Prefer server-rendered composition by default, isolate interactivity, and avoid backend/data-layer changes unless explicitly requested.
---

# Frontend UI (Global)

Use this skill across repositories for consistent UI quality.

## Default policy
1. Prefer existing design system/components in the target repo.
2. Prefer utility-first styling used by the target repo.
3. Keep server-rendered composition by default; isolate interactive logic.

## Boundaries
1. Do UI/layout/state presentation work.
2. Do not modify API/DB/auth/business logic unless requested.

## A11y baseline
1. Keyboard access across all primary actions.
2. Visible focus on interactive controls.
3. Labels/accessible names for form controls.
4. Semantic elements before ARIA workarounds.
5. Prefer semantic HTML structure over generic wrappers.

## Responsive baseline
1. Validate small and large viewport behavior.
2. Avoid layout shifts and overflow traps in primary flows.

## Structure baseline
1. Keep components small and purpose-driven.
2. Split repeated/complex UI into separate components/files.
3. Avoid unnecessary tag nesting; wrappers must have explicit purpose (layout, accessibility, interaction, or measurement).
4. Prefer simpler equivalent DOM trees to reduce maintenance and styling complexity.

## Output format
1. What changed
2. Files modified/created
3. Behavior notes (a11y/responsive/edge cases)
4. Verification commands
