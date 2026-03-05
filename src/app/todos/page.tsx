import { redirect } from "next/navigation";

import { logoutAction } from "@/app/todos/actions";
import { parseTodoFilter } from "@/app/todos/filter";
import type { Todo, TodoFilter } from "@/app/todos/types";
import { TodoCreateForm } from "@/components/todos/todo-create-form";
import { TodoFilterTabs } from "@/components/todos/todo-filter-tabs";
import { TodoList } from "@/components/todos/todo-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TodosPageProps = {
  searchParams?: Promise<{ filter?: string }> | { filter?: string };
};

type TodoRow = {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

function mapTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isCompleted: row.is_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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

  const { data } = await query;
  const todos = ((data ?? []) as TodoRow[]).map(mapTodo);

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
