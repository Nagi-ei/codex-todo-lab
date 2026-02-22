"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { loginActionState } from "@/app/auth/actions";
import { initialAuthActionState } from "@/app/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginActionState,
    initialAuthActionState,
  );
  const latestToastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.status !== "error" || !state.message) {
      return;
    }

    const toastKey = `${state.code ?? "unknown"}:${state.response_status ?? "none"}:${state.message}`;

    if (latestToastKeyRef.current === toastKey) {
      return;
    }

    latestToastKeyRef.current = toastKey;
    toast.error(formatLearningErrorToast(state));

    if (process.env.NODE_ENV !== "production") {
      console.debug("[auth][login]", {
        code: state.code,
        debug_reason: state.debug_reason,
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="login-email">
          이메일
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="login-password">
          비밀번호
        </label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}

function formatLearningErrorToast(state: {
  message?: string;
  code?: string;
  response_status?: number | null;
  debug_reason?: string;
}) {
  const responseStatusLabel =
    state.response_status === null || state.response_status === undefined
      ? "unknown"
      : String(state.response_status);
  const appCodeLabel = state.code ?? "unknown";
  const debugReasonLabel = state.debug_reason ?? "n/a";

  return `${state.message} | app_code: ${appCodeLabel} | response_status: ${responseStatusLabel} | server_response: ${debugReasonLabel}`;
}
