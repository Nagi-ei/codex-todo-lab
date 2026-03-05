# Supabase Migration Runbook (todos)

## Migration file
- `supabase/migrations/20260306022000_create_todos.sql`

## Apply (Dashboard SQL Editor)
1. Open your Supabase project SQL Editor.
2. Paste the migration SQL and run it.
3. Confirm table exists:
   - `select to_regclass('public.todos');`

## Validate policies
Run checks with two users (A/B):
1. User A inserts row with own `user_id` -> success.
2. User A reads user B rows -> blocked.
3. User A updates/deletes user B rows -> blocked.
4. Insert with mismatched `user_id` -> blocked.

## Rollback (manual)
```sql
-- WARNING: destructive, use only when rollback is required.
drop policy if exists "todos_select_own" on public.todos;
drop policy if exists "todos_insert_own" on public.todos;
drop policy if exists "todos_update_own" on public.todos;
drop policy if exists "todos_delete_own" on public.todos;
drop table if exists public.todos;
```
