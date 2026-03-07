# Supabase Migration Runbook (todos)

## Migration file
- `supabase/migrations/20260306022000_create_todos.sql`

## Apply (CLI - Recommended)
1. `supabase login`
2. `supabase link --project-ref <your-project-ref>`
3. `supabase db push`
4. Confirm table exists:
   - `select to_regclass('public.todos');`

## Apply (Dashboard SQL Editor - Fallback)
1. Open your Supabase project SQL Editor.
2. Paste `supabase/migrations/20260306022000_create_todos.sql` and run it.
3. Use this only when CLI application is blocked or when you are recovering a broken environment.

## Validate policies
Run checks with two users (A/B):
1. User A inserts row with own `user_id` -> success.
2. User A reads user B rows -> blocked.
3. User A updates/deletes user B rows -> blocked.
4. Insert with mismatched `user_id` -> blocked.

## Branch 03 Operational Validation Record

Use this format when closing `feature/03--supabase-rls-and-security-hardening`.

Required fields:
- validation date/time
- Supabase project or environment
- actor (`user A` or `user B`)
- scenario
- expected result
- actual result
- supporting note, screenshot reference, or error message

Recommended scenario set:
1. User A inserts own todo row -> success
2. User B reads user A rows -> blocked or zero rows
3. User B updates user A row -> blocked
4. User B deletes user A row -> blocked
5. Authenticated user inserts with mismatched `user_id` -> blocked

Example record:

```md
- Date/Time: `2026-03-08 15:30 KST`
- Environment: `Supabase dev project`
- Actor: `user B`
- Scenario: `update user A row`
- Expected: `RLS blocks update because auth.uid() != user_id`
- Actual: `Update failed with policy error`
- Evidence: `SQL editor result / app error message`
```

## Drift warning
- If you run the SQL manually in Dashboard, your remote database can drift from the migration history tracked in git.
- Prefer `supabase db push` for normal branch workflow.

## Rollback (manual)
```sql
-- WARNING: destructive, use only when rollback is required.
drop policy if exists "todos_select_own" on public.todos;
drop policy if exists "todos_insert_own" on public.todos;
drop policy if exists "todos_update_own" on public.todos;
drop policy if exists "todos_delete_own" on public.todos;
drop table if exists public.todos;
```
