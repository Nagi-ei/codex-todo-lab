---
name: ui-a11y-smoke
description: Run quick accessibility and responsive smoke checks for React/Next.js UI changes, especially with shadcn/ui and Tailwind. Use after UI implementation or refactor before final review.
---

# UI A11y Smoke

Run a fast, repeatable checklist for keyboard, focus, semantics, and responsive behavior.

## Checklist
1. Keyboard-only navigation reaches all interactive controls.
2. Focus ring is visible on every interactive element.
3. Every input has `label`, `aria-label`, or `aria-labelledby`.
4. No clickable `div` where `button`/`a` is appropriate.
5. Dialog/Drawer traps focus and closes with Escape.
6. Color contrast is acceptable in light/dark mode.
7. Mobile viewport (375px) and desktop viewport (1280px) both usable.

## Minimal Test Steps
1. Open target page in browser.
2. Tab through primary flow from top to bottom.
3. Trigger open/close of dialog or drawer.
4. Submit one successful and one invalid form.
5. Switch to dark mode and repeat core flow.

## Reporting Format
```md
## A11y Smoke Report
- Scope:
- Passed:
- Failed:
- Notes:
- Follow-up fixes:
```

## Guardrails
1. Report concrete selectors/components, not vague statements.
2. Separate defects from enhancement ideas.
3. If a check is not applicable, mark `N/A` with reason.
