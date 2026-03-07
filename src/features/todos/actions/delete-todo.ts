"use server";

import { deleteTodoMutation } from "@/features/todos/services/todo-mutations";

export async function deleteTodoAction(id: string) {
  return deleteTodoMutation(id);
}
