"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { TodoActionResult } from "./action-types";
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

type TodoActionFieldErrors = {
  title?: string[];
};

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

function toUnauthorizedResult(): TodoActionResult {
  return {
    ok: false,
    code: "unauthorized",
    message: "로그인이 필요합니다.",
  };
}

function toUnknownResult(): TodoActionResult {
  return {
    ok: false,
    code: "unknown",
    message: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  };
}

function toValidationResult(fieldErrors: TodoActionFieldErrors): TodoActionResult {
  return {
    ok: false,
    code: "validation_failed",
    message: "입력값을 확인해 주세요.",
    fieldErrors,
  };
}

async function getUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function createTodoAction(
  input: CreateTodoInput,
): Promise<TodoActionResult> {
  const parsed = createTodoSchema.safeParse(input);

  if (!parsed.success) {
    return toValidationResult(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getUserId();

  if (!userId) {
    return toUnauthorizedResult();
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
    return toUnknownResult();
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
  const parsed = updateTodoSchema.safeParse(input);

  if (!parsed.success) {
    return toValidationResult(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getUserId();

  if (!userId) {
    return toUnauthorizedResult();
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
    .single<TodoRow>();

  if (error) {
    return toUnknownResult();
  }

  if (!data) {
    return {
      ok: false,
      code: "not_found",
      message: "할 일을 찾을 수 없습니다.",
    };
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
