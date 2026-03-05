"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type {
  TodoActionErrorCode,
  TodoActionErrorDetails,
  TodoActionResult,
} from "./action-types";
import { createTodoSchema, updateTodoSchema } from "./schema";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "./types";

type TodoRow = {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

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
  message: string;
  requestId: string;
  details?: TodoActionErrorDetails;
}): TodoActionResult {
  return {
    ok: false,
    code: input.code,
    message: input.message,
    response: {
      transportStatus: 200,
      requestId: input.requestId,
      details: input.details,
    },
  };
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
      message: "입력값을 확인해 주세요.",
      requestId,
      details: {
        reason: "schema_validation_failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    });
  }

  const { supabase, userId } = await getActionContext();

  if (!userId) {
    return toErrorResult({
      code: "unauthorized",
      message: "로그인이 필요합니다.",
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
      message: "할 일을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
      message: "입력값을 확인해 주세요.",
      requestId,
      details: {
        reason: "schema_validation_failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    });
  }

  const { supabase, userId } = await getActionContext();

  if (!userId) {
    return toErrorResult({
      code: "unauthorized",
      message: "로그인이 필요합니다.",
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
      message: "할 일을 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
      message: "할 일을 찾을 수 없습니다.",
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
      message: "로그인이 필요합니다.",
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
      message: "할 일을 조회하지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
      message: "할 일을 찾을 수 없습니다.",
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
      message: "완료 상태를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
      message: "로그인이 필요합니다.",
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
      message: "할 일을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
      message: "할 일을 찾을 수 없습니다.",
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
