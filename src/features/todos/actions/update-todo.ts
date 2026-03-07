"use server";

import { updateTodoSchema } from "@/features/todos/schema/todo";
import { mapTodo } from "@/features/todos/presentation/todo";
import type { TodoActionResult } from "@/features/todos/types/todo-action";
import type { UpdateTodoInput } from "@/features/todos/types/todo";
import type { TodoRow } from "@/features/todos/types/todo";
import {
  createRequestId,
  toErrorResult,
  toTitleFieldErrorKeys,
} from "@/features/todos/services/action-result";
import { getTodoActionContext } from "@/features/todos/services/action-context";

export async function updateTodoAction(
  id: string,
  input: UpdateTodoInput,
): Promise<TodoActionResult> {
  const requestId = createRequestId();
  const parsed = updateTodoSchema.safeParse(input);

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

  const payload: { title?: string; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.title !== undefined) {
    payload.title = parsed.data.title;
  }

  const { data, error } = await supabase
    .from("todos")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,user_id,title,is_completed,created_at,updated_at")
    .maybeSingle<TodoRow>();

  if (error) {
    return toErrorResult({
      code: "db_update_failed",
      messageKey: "todo.db_update_failed",
      message: "Failed to update todo.",
      requestId,
      details: {
        reason: "todos_update_failed",
        providerMessage: error.message,
      },
    });
  }

  if (!data) {
    return toErrorResult({
      code: "not_found",
      messageKey: "todo.not_found",
      message: "Todo not found.",
      requestId,
      details: {
        reason: "todo_not_found",
      },
    });
  }

  return {
    ok: true,
    todo: mapTodo(data),
  };
}
