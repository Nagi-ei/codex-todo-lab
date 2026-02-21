import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full space-y-4 p-6">
        <h1 className="text-2xl font-semibold">이메일을 확인해 주세요</h1>
        <p className="text-sm text-muted-foreground">
          회원가입이 접수되었습니다. 메일함에서 확인 링크를 연 뒤 로그인해 주세요.
        </p>
        <Button asChild>
          <Link href="/login">로그인으로 이동</Link>
        </Button>
      </Card>
    </main>
  );
}
