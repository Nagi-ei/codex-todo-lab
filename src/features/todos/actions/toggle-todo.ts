"use server";

import { mapTodo } from "@/features/todos/presentation/todo";
import type { TodoActionResult } from "@/features/todos/types/todo-action";
import type { TodoRow } from "@/features/todos/types/todo";
import { createRequestId, toErrorResult } from "@/features/todos/services/action-result";
import { getTodoActionContext } from "@/features/todos/services/action-context";

export async function toggleTodoAction(id: string): Promise<TodoActionResult> {
  const requestId = createRequestId();
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

  const { data: currentTodo, error: readError } = await supabase
    .from("todos")
    .select("id,user_id,title,is_completed,created_at,updated_at")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle<TodoRow>();

  if (readError) {
    return toErrorResult({
      code: "db_read_failed",
      messageKey: "todo.db_read_failed",
      message: "Failed to read todo.",
      requestId,
      details: {
        reason: "todo_read_before_toggle_failed",
        providerMessage: readError.message,
      },
    });
  }

  if (!currentTodo) {
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

  const { data, error } = await supabase
    .from("todos")
    .update({
      is_completed: !currentTodo.is_completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,user_id,title,is_completed,created_at,updated_at")
    .single<TodoRow>();

  if (error || !data) {
    return toErrorResult({
      code: "db_update_failed",
      messageKey: "todo.db_update_failed",
      message: "Failed to toggle todo completion.",
      requestId,
      details: {
        reason: "todo_toggle_update_failed",
        providerMessage: error?.message,
      },
    });
  }

  return {
    ok: true,
    todo: mapTodo(data),
  };
}
