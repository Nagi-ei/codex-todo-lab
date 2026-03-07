"use server";

import { mapTodo } from "@/features/todos/presentation/todo";
import type { TodoActionResult } from "@/features/todos/types/todo-action";
import type { TodoRow } from "@/features/todos/types/todo";
import { createRequestId, toErrorResult } from "@/features/todos/services/action-result";
import { getTodoActionContext } from "@/features/todos/services/action-context";

export async function deleteTodoAction(id: string): Promise<TodoActionResult> {
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

  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,user_id,title,is_completed,created_at,updated_at")
    .maybeSingle<TodoRow>();

  if (error) {
    return toErrorResult({
      code: "db_delete_failed",
      messageKey: "todo.db_delete_failed",
      message: "Failed to delete todo.",
      requestId,
      details: {
        reason: "todo_delete_failed",
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
