import Link from "next/link";

import { AuthTabs } from "@/components/auth/auth-tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AuthPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-semibold">계정 인증</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          로그인 또는 회원가입을 진행하세요.
        </p>

        <div className="mt-6">
          <AuthTabs loginContent={<LoginForm />} signupContent={<SignupForm />} />
        </div>

        <div className="mt-6 flex justify-end">
          <Button asChild size="sm" variant="outline">
            <Link href="/">홈으로 이동</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
