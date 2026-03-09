---
name: frontend-ui
description: Implement or refactor UI in this repository using shadcn/ui and TailwindCSS v4. Prefer Next.js Server Components, use Client Components only when needed, and avoid server/data-layer changes unless explicitly requested.
---

# Frontend UI

Use this skill for UI work in this project.

## Project assumptions
1. Framework: Next.js App Router + React + TypeScript.
2. UI primitives: prefer `shared/ui/shadcn` when available.
3. Styling: TailwindCSS v4 utility-first approach.

## Hard rules
1. Use Server Components by default.
2. Use Client Components only for events/hooks/browser APIs.
3. Do not change DB/API/auth rules unless explicitly requested.
4. Keep one exported component per file.
5. Use semantic HTML first (`main`, `nav`, `section`, `article`, `ul/li`, `button`, `label`).
6. Avoid unnecessary wrapper nesting; add a wrapper only for clear layout, accessibility, state, or behavior needs.

## UI quality
1. Ensure keyboard navigation and visible focus.
2. Ensure labels for inputs/controls.
3. Ensure responsive behavior for mobile/desktop.
4. Ensure dark mode compatibility using `dark:` variants.
5. Remove meaningless DOM layers and prefer simpler markup when behavior is equivalent.

## Mobile editing pattern
1. Prefer Drawer for editing flows on small screens when secondary panel UX is needed.
2. Keep drawer state logic isolated in the smallest Client Component.

## Delivery format
1. What changed
2. Files modified/created
3. Important behavior (a11y/responsive/dark mode)
4. Commands to run
5. Reviewer notes
