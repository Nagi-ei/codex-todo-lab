# Cycle 5 Snapshot

- Date: `2026-03-08`
- Trigger:
  - follow-up review found that todo Server Actions still act as forwarding-only wrappers, todo components still own `useMutation` wiring, and the repository layer does not yet justify its existence.
- Best-practice summary:
  - `frontend-architecture-rules` requires UI components to render and delegate, and encourages hooks for reusable UI-facing stateful behavior.
  - the same rules do not require an extra service or repository layer when it does not create a meaningful architectural boundary.
- Decision:
  - reopen branch 05 for a fifth cycle focused on direct Server Actions, feature-local todo mutation hooks, and removal of low-value indirection in the mutation path.

## Target Structure

```text
src/features/todos/
  actions/
    create-todo.ts
    update-todo.ts
    toggle-todo.ts
    delete-todo.ts
  hooks/
    use-create-todo-mutation.ts
    use-update-todo-mutation.ts
    use-toggle-todo-mutation.ts
    use-delete-todo-mutation.ts
  services/
    action-context.ts
    action-result.ts
    todo-read.ts
  schema/
  types/
  presentation/
```

## Layer Decisions

- Server Action:
  - owns validation, auth, mutation execution, and action result shaping.
  - should not remain as a one-line pass-through into another mutation file.
- UI Hook:
  - owns `useMutation`, toast handling, `router.refresh()`, and mutation success/failure orchestration.
  - should be imported by todo components instead of defining `useMutation` inline.
- Component:
  - owns render tree and local UI state such as dialog open/title input.
  - should not own server mutation orchestration.
- Service:
  - remains only for shared helpers or shared server flows with real reuse.
- Repository:
  - remove it unless it exposes a persistence contract that is more meaningful than a query-chain wrapper.

## Stop Conditions

- If action files start duplicating large blocks of result-shaping logic, stop and extract only the shared helper rather than restoring wrapper layers.
- If hook extraction increases component coupling instead of reducing it, stop and simplify the hook contract before touching more files.
- If direct-action changes break auth/todo behavior, fix the failing action first before adding any extra abstraction.
