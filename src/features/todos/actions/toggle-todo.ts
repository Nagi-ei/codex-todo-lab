"use server";

import { toggleTodoMutation } from "@/features/todos/services/todo-mutations";

export async function toggleTodoAction(id: string) {
  return toggleTodoMutation(id);
}
