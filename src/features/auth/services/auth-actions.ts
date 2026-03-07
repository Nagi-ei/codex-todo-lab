import type { AuthError } from "@supabase/supabase-js";

import type { AuthActionResult, AuthCredentials } from "@/features/auth/types/auth";
import {
  createSupabaseAdminClient,
  shouldAutoConfirmEmails,
} from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeCredentials(input: AuthCredentials): AuthCredentials {
  return {
    email: String(input.email ?? "").trim(),
    password: String(input.password ?? ""),
  };
}

function toMissingCredentialsError(): AuthActionResult {
  return {
    ok: false,
    code: "missing_credentials",
    message: "이메일과 비밀번호를 모두 입력해 주세요.",
    debug_reason: "missing_credentials",
    response_status: null,
  };
}

function toLoginErrorResult(error: AuthError): AuthActionResult {
  const message = error.message.toLowerCase();
  const isEmailNotConfirmed = message.includes("email not confirmed");

  if (isEmailNotConfirmed) {
    return {
      ok: false,
      code: "email_not_confirmed",
      message: "이메일 확인 후 로그인해 주세요.",
      debug_reason: error.message,
      response_status: getResponseStatus(error),
    };
  }

  return {
    ok: false,
    code: "invalid_credentials",
    message: "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.",
    debug_reason: error.message,
    response_status: getResponseStatus(error),
  };
}

function toSignupErrorResult(
  error: AuthError,
  source: "admin_create" | "public_signup",
): AuthActionResult {
  const message = error.message.toLowerCase();

  if (message.includes("already registered") || message.includes("already exists")) {
    return {
      ok: false,
      code: "signup_failed",
      message: "이미 가입된 이메일입니다. 로그인해 주세요.",
      debug_reason: `${source}: ${error.message}`,
      response_status: getResponseStatus(error),
    };
  }

  if (message.includes("rate limit")) {
    return {
      ok: false,
      code: "signup_failed",
      message: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
      debug_reason: `${source}: ${error.message}`,
      response_status: getResponseStatus(error),
    };
  }

  return {
    ok: false,
    code: "signup_failed",
    message: "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    debug_reason: `${source}: ${error.message}`,
    response_status: getResponseStatus(error),
  };
}

function getResponseStatus(error: AuthError): number | null {
  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  return null;
}

export async function loginWithEmail(
  input: AuthCredentials,
): Promise<AuthActionResult> {
  const { email, password } = normalizeCredentials(input);

  if (!email || !password) {
    return toMissingCredentialsError();
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return toLoginErrorResult(error);
  }

  return {
    ok: true,
    code: "ok",
    next: "/todos",
  };
}

export async function signupWithEmail(
  input: AuthCredentials,
): Promise<AuthActionResult> {
  const { email, password } = normalizeCredentials(input);

  if (!email || !password) {
    return toMissingCredentialsError();
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
        return toSignupErrorResult(createUserError, "admin_create");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return toLoginErrorResult(signInError);
      }

      return {
        ok: true,
        code: "ok",
        next: "/todos",
      };
    }
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return toSignupErrorResult(error, "public_signup");
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
            return {
              ok: true,
              code: "ok",
              next: "/todos",
            };
          }
        }
      }
    }

    return {
      ok: true,
      code: "ok",
      next: "/auth/check-email",
    };
  }

  return {
    ok: true,
    code: "ok",
    next: "/todos",
  };
}
