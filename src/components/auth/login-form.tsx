"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

import { loginMutationAction } from "@/app/auth/actions";
import type { AuthActionResult } from "@/app/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const latestToastKeyRef = useRef<string | null>(null);
  const mutation = useMutation({
    mutationFn: loginMutationAction,
    onSuccess: (result) => {
      if (result.ok) {
        router.push(result.next);
        return;
      }

      const toastKey = `${result.code}:${result.response_status ?? "none"}:${result.message}`;

      if (latestToastKeyRef.current === toastKey) {
        return;
      }

      latestToastKeyRef.current = toastKey;
      toast.error(formatLearningErrorToast(result));

      if (process.env.NODE_ENV !== "production") {
        console.debug("[auth][login]", {
          code: result.code,
          debug_reason: result.debug_reason,
        });
      }
    },
  });

  async function handleSubmit(formData: FormData) {
    await mutation.mutateAsync({
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
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

      <Button className="w-full" disabled={mutation.isPending} type="submit">
        {mutation.isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}

function formatLearningErrorToast(state: Extract<AuthActionResult, { ok: false }>) {
  const responseStatusLabel =
    state.response_status === null || state.response_status === undefined
      ? "unknown"
      : String(state.response_status);
  const appCodeLabel = state.code ?? "unknown";
  const debugReasonLabel = state.debug_reason ?? "n/a";

  return `${state.message} | app_code: ${appCodeLabel} | response_status: ${responseStatusLabel} | server_response: ${debugReasonLabel}`;
}
