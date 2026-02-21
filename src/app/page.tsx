import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Learning Todo App</h1>
        <p className="text-sm text-muted-foreground">
          Supabase 인증과 보호 라우트 실습용 기본 홈 화면입니다.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/login">로그인</Link>
          </Button>
          <Button asChild className="flex-1" variant="secondary">
            <Link href="/todos">Todos</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
