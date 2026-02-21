"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { signupActionState } from "@/app/auth/actions";
import { initialAuthActionState } from "@/app/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupActionState,
    initialAuthActionState,
  );

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
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

      {state.status === "error" && state.message ? (
        <p
          className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <Button className="w-full" disabled={isPending} type="submit" variant="secondary">
        {isPending ? "가입 처리 중..." : "회원가입"}
      </Button>
    </form>
  );
}
