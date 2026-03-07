import type { createSupabaseServerClient } from "@/lib/supabase/server";

import type { TodoRow } from "@/features/todos/types/todo";

type TodoSupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

const TODO_ROW_SELECT = "id,user_id,title,is_completed,created_at,updated_at";

export async function insertTodoForUser(input: {
  supabase: TodoSupabaseClient;
  userId: string;
  title: string;
}): Promise<{ data: TodoRow | null; error: { message: string } | null }> {
  const { data, error } = await input.supabase
    .from("todos")
    .insert({
      user_id: input.userId,
      title: input.title,
    })
    .select(TODO_ROW_SELECT)
    .single<TodoRow>();

  return {
    data,
    error,
  };
}

export async function updateTodoForUser(input: {
  supabase: TodoSupabaseClient;
  userId: string;
  todoId: string;
  patch: {
    title?: string;
    is_completed?: boolean;
    updated_at: string;
  };
  expectSingle?: boolean;
}): Promise<{ data: TodoRow | null; error: { message: string } | null }> {
  const query = input.supabase
    .from("todos")
    .update(input.patch)
    .eq("id", input.todoId)
    .eq("user_id", input.userId)
    .select(TODO_ROW_SELECT);

  if (input.expectSingle) {
    const { data, error } = await query.single<TodoRow>();
    return {
      data,
      error,
    };
  }

  const { data, error } = await query.maybeSingle<TodoRow>();
  return {
    data,
    error,
  };
}

export async function findTodoForUser(input: {
  supabase: TodoSupabaseClient;
  userId: string;
  todoId: string;
}): Promise<{ data: TodoRow | null; error: { message: string } | null }> {
  const { data, error } = await input.supabase
    .from("todos")
    .select(TODO_ROW_SELECT)
    .eq("id", input.todoId)
    .eq("user_id", input.userId)
    .maybeSingle<TodoRow>();

  return {
    data,
    error,
  };
}

export async function deleteTodoForUser(input: {
  supabase: TodoSupabaseClient;
  userId: string;
  todoId: string;
}): Promise<{ data: TodoRow | null; error: { message: string } | null }> {
  const { data, error } = await input.supabase
    .from("todos")
    .delete()
    .eq("id", input.todoId)
    .eq("user_id", input.userId)
    .select(TODO_ROW_SELECT)
    .maybeSingle<TodoRow>();

  return {
    data,
    error,
  };
}
