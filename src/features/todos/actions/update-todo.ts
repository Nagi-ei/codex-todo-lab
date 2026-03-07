"use server";

import type { UpdateTodoInput } from "@/features/todos/types/todo";
import { updateTodoMutation } from "@/features/todos/services/todo-mutations";

export async function updateTodoAction(id: string, input: UpdateTodoInput) {
  return updateTodoMutation(id, input);
}
