import { TodoItem } from "@/components/todos/todo-item";
import type { TodoFilter, Todo } from "@/features/todos/types/todo";

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
    <ul aria-live="polite" className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
