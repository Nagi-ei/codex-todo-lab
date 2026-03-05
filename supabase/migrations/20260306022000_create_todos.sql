-- Migration: create todos table + rls policies
-- Branch: feature/02--todo-domain-and-server-actions
-- Note: Execute via Supabase SQL Editor or Supabase CLI against the target project.

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_todos_user_id on public.todos (user_id);
create index if not exists idx_todos_user_created_at_desc on public.todos (user_id, created_at desc);

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
