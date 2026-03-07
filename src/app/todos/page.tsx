import { redirect } from "next/navigation";

import { logoutAction } from "@/app/todos/actions";
import { TodoCreateForm } from "@/components/todos/todo-create-form";
import { TodoFilterTabs } from "@/components/todos/todo-filter-tabs";
import { TodoList } from "@/components/todos/todo-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseTodoFilter } from "@/features/todos/presentation/filter";
import { getTodoReadErrorMessage } from "@/features/todos/presentation/read-error";
import { mapTodo } from "@/features/todos/presentation/todo";
import type { TodoFilter, TodoRow } from "@/features/todos/types/todo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TodosPageProps = {
  searchParams?: Promise<{ filter?: string }> | { filter?: string };
};

function resolveFilter(searchParams: { filter?: string } | undefined): TodoFilter {
  return parseTodoFilter(searchParams?.filter);
}

async function resolveSearchParams(
  searchParams: TodosPageProps["searchParams"],
): Promise<{ filter?: string }> {
  if (!searchParams) {
    return {};
  }

  if (searchParams instanceof Promise) {
    return searchParams;
  }

  return searchParams;
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const activeFilter = resolveFilter(resolvedSearchParams);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  let query = supabase
    .from("todos")
    .select("id,user_id,title,is_completed,created_at,updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (activeFilter === "active") {
    query = query.eq("is_completed", false);
  }

  if (activeFilter === "completed") {
    query = query.eq("is_completed", true);
  }

  const { data, error } = await query;
  const todos = ((data ?? []) as TodoRow[]).map(mapTodo);
  const readErrorMessage = getTodoReadErrorMessage(error?.message ?? null);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl px-4 py-8">
      <Card className="w-full space-y-5 p-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Todos</h1>
          <p className="text-sm text-muted-foreground">
            현재 로그인: <span className="font-medium text-foreground">{user.email}</span>
          </p>
        </header>

        <TodoCreateForm />
        <TodoFilterTabs activeFilter={activeFilter} />
        {readErrorMessage ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {readErrorMessage}
          </div>
        ) : null}
        <TodoList activeFilter={activeFilter} todos={todos} />

        <form action={logoutAction}>
          <Button type="submit" variant="outline">
            로그아웃
          </Button>
        </form>
      </Card>
    </main>
  );
}
