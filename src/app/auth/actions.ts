"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSupabaseAdminClient,
  shouldAutoConfirmEmails,
} from "@/lib/supabase/admin";
import type { AuthActionState } from "@/app/auth/types";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  return { email, password };
}

export async function loginActionState(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
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
    return toLoginErrorState(prevState, error);
  }

  redirect("/todos");
}

export async function signupActionState(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
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

  if (shouldAutoConfirmEmails()) {
    const admin = createSupabaseAdminClient();

    if (admin) {
      const { error: createUserError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createUserError) {
        return toSignupErrorState(prevState, createUserError, "admin_create");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return toLoginErrorState(prevState, signInError);
      }

      redirect("/todos");
    }
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return toSignupErrorState(prevState, error, "public_signup");
  }

  if (!data.session) {
    if (shouldAutoConfirmEmails() && data.user?.id) {
      const admin = createSupabaseAdminClient();

      if (admin) {
        const { error: confirmError } = await admin.auth.admin.updateUserById(
          data.user.id,
          { email_confirm: true },
        );

        if (!confirmError) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!signInError) {
            redirect("/todos");
          }
        }
      }
    }

    redirect("/auth/check-email");
  }

  redirect("/todos");
}

function toLoginErrorState(
  prevState: AuthActionState,
  error: AuthError,
): AuthActionState {
  const message = error.message.toLowerCase();
  const isEmailNotConfirmed = message.includes("email not confirmed");

  if (isEmailNotConfirmed) {
    return {
      ...prevState,
      status: "error",
      code: "email_not_confirmed",
      message: "이메일 확인 후 로그인해 주세요.",
    };
  }

  return {
    ...prevState,
    status: "error",
    code: "invalid_credentials",
    message: `로그인에 실패했습니다. (${error.message})`,
  };
}

function toSignupErrorState(
  prevState: AuthActionState,
  error: AuthError,
  source: "admin_create" | "public_signup",
): AuthActionState {
  const message = error.message.toLowerCase();

  if (message.includes("already registered") || message.includes("already exists")) {
    return {
      ...prevState,
      status: "error",
      code: "signup_failed",
      message: `이미 가입된 이메일입니다. 로그인해 주세요. (${source})`,
    };
  }

  return {
    ...prevState,
    status: "error",
    code: "signup_failed",
    message: `회원가입에 실패했습니다. (${source}: ${error.message})`,
  };
}
