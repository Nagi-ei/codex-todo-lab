import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { logoutAction } from "./actions";

export default async function TodosPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-semibold">Todos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          로그인된 사용자만 접근할 수 있습니다.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          현재 로그인: <span className="font-medium text-foreground">{user.email}</span>
        </p>

        <form action={logoutAction} className="mt-6">
          <Button type="submit" variant="outline">
            로그아웃
          </Button>
        </form>
      </Card>
    </main>
  );
}
