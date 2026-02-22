"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

import { signupMutationAction } from "@/app/auth/actions";
import type { AuthActionResult } from "@/app/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const router = useRouter();
  const latestToastKeyRef = useRef<string | null>(null);
  const mutation = useMutation({
    mutationFn: signupMutationAction,
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
        console.debug("[auth][signup]", {
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
        <label className="text-sm font-medium" htmlFor="signup-email">
          이메일
        </label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="signup-password">
          비밀번호
        </label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <Button
        className="w-full"
        disabled={mutation.isPending}
        type="submit"
        variant="secondary"
      >
        {mutation.isPending ? "가입 처리 중..." : "회원가입"}
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
