"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { initialAuthActionState, type AuthActionState } from "@/app/login/types";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  return { email, password };
}

function resolveArgs(
  first: AuthActionState | FormData,
  second?: FormData,
): { prevState: AuthActionState; formData: FormData } {
  if (first instanceof FormData) {
    return {
      prevState: initialAuthActionState,
      formData: first,
    };
  }

  if (!second) {
    throw new Error("Missing formData");
  }

  return {
    prevState: first,
    formData: second,
  };
}

export async function loginAction(
  first: AuthActionState | FormData,
  second?: FormData,
): Promise<AuthActionState> {
  const { prevState, formData } = resolveArgs(first, second);
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    return {
      ...prevState,
      status: "error",
      code: "missing_credentials",
      message: "이메일과 비밀번호를 모두 입력해 주세요.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ...prevState,
      status: "error",
      code: "invalid_credentials",
      message: "로그인에 실패했습니다. 이메일/비밀번호를 확인해 주세요.",
    };
  }

  redirect("/todos");
}

export async function loginActionRedirect(formData: FormData): Promise<void> {
  const result = await loginAction(initialAuthActionState, formData);

  if (result.status === "error") {
    redirect(`/login?error=${result.code ?? "unknown"}`);
  }
}

export async function signupAction(formData: FormData) {
  const result = await signupActionState(initialAuthActionState, formData);

  if (result.status === "error") {
    redirect(`/login?error=${result.code ?? "unknown"}`);
  }
}

export async function signupActionState(
  first: AuthActionState | FormData,
  second?: FormData,
): Promise<AuthActionState> {
  const { prevState, formData } = resolveArgs(first, second);
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    return {
      ...prevState,
      status: "error",
      code: "missing_credentials",
      message: "이메일과 비밀번호를 모두 입력해 주세요.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return {
      ...prevState,
      status: "error",
      code: "signup_failed",
      message: "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (!data.session) {
    redirect("/auth/check-email");
  }

  redirect("/todos");
}
