import Link from "next/link";

import { AuthTabs } from "@/components/auth/auth-tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Card } from "@/components/ui/card";
export default function LoginPage() {

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-semibold">로그인</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          이메일/비밀번호로 로그인하거나 회원가입을 진행하세요.
        </p>

        <div className="mt-6">
          <AuthTabs
            loginContent={<LoginForm />}
            signupContent={<SignupForm />}
          />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          루트로 이동:{" "}
          <Link className="underline underline-offset-2" href="/">
            홈
          </Link>
        </p>
      </Card>
    </main>
  );
}
