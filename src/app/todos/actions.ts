"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createTodo,
  deleteTodo,
  toggleTodo,
  updateTodo,
} from "@/features/todos/services/todo-actions";
import type { CreateTodoInput, UpdateTodoInput } from "@/features/todos/types/todo";

export async function createTodoAction(input: CreateTodoInput) {
  return createTodo(input);
}

export async function updateTodoAction(id: string, input: UpdateTodoInput) {
  return updateTodo(id, input);
}

export async function toggleTodoAction(id: string) {
  return toggleTodo(id);
}

export async function deleteTodoAction(id: string) {
  return deleteTodo(id);
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth");
}
