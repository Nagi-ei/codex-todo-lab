"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

import {
  buildAuthErrorToastKey,
  formatLearningAuthErrorToast,
} from "@/components/auth/auth-error-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupMutationAction } from "@/features/auth/actions/signup";

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

      const toastKey = buildAuthErrorToastKey(result);

      if (latestToastKeyRef.current === toastKey) {
        return;
      }

      latestToastKeyRef.current = toastKey;
      toast.error(formatLearningAuthErrorToast(result));

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
