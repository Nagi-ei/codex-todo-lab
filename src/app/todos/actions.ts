"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createTodoSchema, updateTodoSchema } from "@/features/todos/schema/todo";
import type { CreateTodoInput, Todo, TodoRow, UpdateTodoInput } from "@/features/todos/types/todo";

import type {
  TodoActionErrorCode,
  TodoActionMessageKey,
  TodoTitleFieldErrorKey,
  TodoActionErrorDetails,
  TodoActionResult,
} from "./action-types";

function createRequestId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function mapTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isCompleted: row.is_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toErrorResult(input: {
  code: TodoActionErrorCode;
  messageKey: TodoActionMessageKey;
  message: string;
  requestId: string;
  details?: TodoActionErrorDetails;
}): TodoActionResult {
  return {
    ok: false,
    code: input.code,
    messageKey: input.messageKey,
    message: input.message,
    response: {
      transportStatus: 200,
      requestId: input.requestId,
      details: input.details,
    },
  };
}

function toTitleFieldErrorKeys(error: {
  issues: Array<{ path: PropertyKey[]; code: string }>;
}): TodoTitleFieldErrorKey[] {
  const keys = new Set<TodoTitleFieldErrorKey>();

  for (const issue of error.issues) {
    const pathHasTitle = issue.path.some((segment) => segment === "title");
    if (!pathHasTitle) {
      continue;
    }

    if (issue.code === "too_small") {
      keys.add("title_required");
      continue;
    }

    if (issue.code === "too_big") {
      keys.add("title_too_long");
      continue;
    }

    keys.add("title_invalid");
  }

  if (keys.size === 0) {
    keys.add("title_invalid");
  }

  return Array.from(keys);
}

async function getActionContext(): Promise<{
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  userId: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabase,
    userId: user?.id ?? null,
  };
}

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

  const { supabase, userId } = await getActionContext();

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

  const { supabase, userId } = await getActionContext();

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

export async function toggleTodoAction(id: string): Promise<TodoActionResult> {
  const requestId = createRequestId();
  const { supabase, userId } = await getActionContext();

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

export async function deleteTodoAction(id: string): Promise<TodoActionResult> {
  const requestId = createRequestId();
  const { supabase, userId } = await getActionContext();

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

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth");
}
