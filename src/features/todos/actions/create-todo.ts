"use server";

import { createTodoSchema } from "@/features/todos/schema/todo";
import { mapTodo } from "@/features/todos/presentation/todo";
import type { TodoActionResult } from "@/features/todos/types/todo-action";
import type { CreateTodoInput } from "@/features/todos/types/todo";
import type { TodoRow } from "@/features/todos/types/todo";
import {
  createRequestId,
  toErrorResult,
  toTitleFieldErrorKeys,
} from "@/features/todos/services/action-result";
import { getTodoActionContext } from "@/features/todos/services/action-context";

export async function createTodoAction(
  input: CreateTodoInput,
): Promise<TodoActionResult> {
  const requestId = createRequestId();
  const parsed = createTodoSchema.safeParse(input);

  if (!parsed.success) {
    return toErrorResult({
      code: "validation_failed",
      messageKey: "todo.validation_failed",
      message: "Validation failed.",
      requestId,
      details: {
        reason: "schema_validation_failed",
        fieldErrors: {
          title: toTitleFieldErrorKeys(parsed.error),
        },
      },
    });
  }

  const { supabase, userId } = await getTodoActionContext();

  if (!userId) {
    return toErrorResult({
      code: "unauthorized",
      messageKey: "todo.unauthorized",
      message: "Authentication required.",
      requestId,
      details: {
        reason: "missing_user",
      },
    });
  }

  const { data, error } = await supabase
    .from("todos")
    .insert({
      user_id: userId,
      title: parsed.data.title,
    })
    .select("id,user_id,title,is_completed,created_at,updated_at")
    .single<TodoRow>();

  if (error || !data) {
    return toErrorResult({
      code: "db_insert_failed",
      messageKey: "todo.db_insert_failed",
      message: "Failed to save todo.",
      requestId,
      details: {
        reason: "todos_insert_failed",
        providerMessage: error?.message,
      },
    });
  }

  return {
    ok: true,
    todo: mapTodo(data),
  };
}
