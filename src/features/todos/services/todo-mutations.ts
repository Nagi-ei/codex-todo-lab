import type { TodoActionResult } from "@/features/todos/types/todo-action";
import { createTodoSchema, updateTodoSchema } from "@/features/todos/schema/todo";
import { mapTodo } from "@/features/todos/presentation/todo";
import {
  deleteTodoForUser,
  findTodoForUser,
  insertTodoForUser,
  updateTodoForUser,
} from "@/features/todos/repositories/todo-repository";
import type { CreateTodoInput, UpdateTodoInput } from "@/features/todos/types/todo";

import { getTodoActionContext } from "./action-context";
import { createRequestId, toErrorResult, toTitleFieldErrorKeys } from "./action-result";

export async function createTodoMutation(
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

  const { data, error } = await insertTodoForUser({
    supabase,
    userId,
    title: parsed.data.title,
  });

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

export async function updateTodoMutation(
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

  const { data, error } = await updateTodoForUser({
    supabase,
    userId,
    todoId: id,
    patch: payload,
  });

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

export async function toggleTodoMutation(id: string): Promise<TodoActionResult> {
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

  const { data: currentTodo, error: readError } = await findTodoForUser({
    supabase,
    userId,
    todoId: id,
  });

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

  const { data, error } = await updateTodoForUser({
    supabase,
    userId,
    todoId: id,
    patch: {
      is_completed: !currentTodo.is_completed,
      updated_at: new Date().toISOString(),
    },
    expectSingle: true,
  });

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

export async function deleteTodoMutation(id: string): Promise<TodoActionResult> {
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

  const { data, error } = await deleteTodoForUser({
    supabase,
    userId,
    todoId: id,
  });

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
