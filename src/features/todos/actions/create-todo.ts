"use server";

import type { CreateTodoInput } from "@/features/todos/types/todo";
import { createTodoMutation } from "@/features/todos/services/todo-mutations";

export async function createTodoAction(input: CreateTodoInput) {
  return createTodoMutation(input);
}
