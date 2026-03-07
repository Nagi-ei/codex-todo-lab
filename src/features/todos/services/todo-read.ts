import { getTodoReadErrorMessage } from "@/features/todos/presentation/read-error";
import { mapTodo } from "@/features/todos/presentation/todo";
import type { Todo, TodoFilter, TodoRow } from "@/features/todos/types/todo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TodoReadResult =
  | {
      user: null;
      todos: Todo[];
      readErrorMessage: null;
    }
  | {
      user: {
        id: string;
        email: string | null;
      };
      todos: Todo[];
      readErrorMessage: string | null;
    };

export async function readTodosForPage(
  activeFilter: TodoFilter,
): Promise<TodoReadResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      todos: [],
      readErrorMessage: null,
    };
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

  return {
    user: {
      id: user.id,
      email: user.email ?? null,
    },
    todos: ((data ?? []) as TodoRow[]).map(mapTodo),
    readErrorMessage: getTodoReadErrorMessage(error?.message ?? null),
  };
}
