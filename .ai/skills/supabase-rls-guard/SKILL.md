---
name: supabase-rls-guard
description: Create or review Supabase Postgres schema and Row Level Security policies for per-user data isolation. Use when implementing tables, policies, auth-bound access control, or when validating that users cannot read/write each other's rows.
---

# Supabase RLS Guard

Implement and validate table + RLS with minimal, safe defaults.

## Workflow
1. Confirm target tables and ownership model (`user_id` ownership or team ownership).
2. Create schema with explicit constraints (not-null, FK, check constraints, timestamps).
3. Enable RLS on every user data table.
4. Add `select/insert/update/delete` policies with explicit ownership predicates.
5. Validate policy behavior with two test users.
6. Summarize SQL and verification results.

## Baseline SQL Pattern (User-Owned Rows)
Use this as the default for single-user ownership.

```sql
alter table public.todos enable row level security;

create policy "todos_select_own"
on public.todos
for select
using (auth.uid() = user_id);

create policy "todos_insert_own"
on public.todos
for insert
with check (auth.uid() = user_id);

create policy "todos_update_own"
on public.todos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "todos_delete_own"
on public.todos
for delete
using (auth.uid() = user_id);
```

## Guardrails
1. Never expose `service_role` key in client code.
2. Never rely only on client-side filtering for isolation.
3. Always use both `using` and `with check` for updates.
4. Keep policy names stable and descriptive.

## Validation Checklist
- [ ] RLS enabled on target table.
- [ ] CRUD policies exist and compile.
- [ ] User A cannot read/update/delete User B rows.
- [ ] Insert fails when `user_id != auth.uid()`.
- [ ] App behavior matches policy errors gracefully.
