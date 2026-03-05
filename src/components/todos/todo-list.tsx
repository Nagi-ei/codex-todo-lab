import type { TodoFilter, Todo } from "@/app/todos/types";

type TodoListProps = {
  todos: Todo[];
  activeFilter: TodoFilter;
};

function getEmptyLabel(filter: TodoFilter): string {
  if (filter === "active") {
    return "진행 중인 할 일이 없습니다.";
  }

  if (filter === "completed") {
    return "완료한 할 일이 없습니다.";
  }

  return "아직 등록된 할 일이 없습니다.";
}

export function TodoList({ todos, activeFilter }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
        {getEmptyLabel(activeFilter)}
      </p>
    );
  }

  return (
    <ul className="space-y-2" aria-live="polite">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between rounded-md border p-3">
          <span className={todo.isCompleted ? "text-muted-foreground line-through" : ""}>
            {todo.title}
          </span>
          <span
            className={todo.isCompleted ? "text-xs text-emerald-600" : "text-xs text-amber-600"}
          >
            {todo.isCompleted ? "완료" : "진행중"}
          </span>
        </li>
      ))}
    </ul>
  );
}
