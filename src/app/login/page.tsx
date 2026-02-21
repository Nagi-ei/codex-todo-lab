import Link from "next/link";

import { AuthTabs } from "@/components/auth/auth-tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { loginActionRedirect, signupAction } from "./actions";

const errorLabelMap: Record<string, string> = {
  missing_credentials: "이메일과 비밀번호를 모두 입력해 주세요.",
  login_failed: "로그인에 실패했습니다. 입력값을 확인해 주세요.",
  invalid_credentials: "로그인에 실패했습니다. 이메일/비밀번호를 확인해 주세요.",
  signup_failed: "회원가입에 실패했습니다. 다시 시도해 주세요.",
  unknown: "요청 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorLabelMap[error] : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-semibold">로그인</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          이메일/비밀번호로 로그인하거나 회원가입을 진행하세요.
        </p>

        {errorMessage ? (
          <p
            className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6">
          <AuthTabs
            loginContent={
              <p className="text-sm text-muted-foreground">
                로그인 입력 폼 분리는 다음 슬라이스에서 진행합니다.
              </p>
            }
            signupContent={
              <p className="text-sm text-muted-foreground">
                회원가입 입력 폼 분리는 다음 슬라이스에서 진행합니다.
              </p>
            }
          />
        </div>

        <form className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              비밀번호
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" formAction={loginActionRedirect} type="submit">
              로그인
            </Button>
            <Button
              className="flex-1"
              formAction={signupAction}
              type="submit"
              variant="secondary"
            >
              회원가입
            </Button>
          </div>
        </form>

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
