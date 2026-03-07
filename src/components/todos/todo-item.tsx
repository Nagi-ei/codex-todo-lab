"use client";

import { TodoEditDialog } from "@/components/todos/todo-edit-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteTodoMutation } from "@/features/todos/hooks/use-delete-todo-mutation";
import { useToggleTodoMutation } from "@/features/todos/hooks/use-toggle-todo-mutation";
import type { Todo } from "@/features/todos/types/todo";

type TodoItemProps = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItemProps) {
  const { isPending: isTogglePending, toggleTodo } = useToggleTodoMutation(todo.id);
  const { deleteTodo, isPending: isDeletePending } = useDeleteTodoMutation(todo.id);
  const isBusy = isTogglePending || isDeletePending;

  return (
    <li className="flex items-center justify-between rounded-md border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Checkbox
          aria-label={`${todo.title} 완료 상태 토글`}
          checked={todo.isCompleted}
          disabled={isBusy}
          onCheckedChange={() => {
            void toggleTodo();
          }}
        />
        <span className={todo.isCompleted ? "line-through text-muted-foreground" : ""}>
          {todo.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <TodoEditDialog todo={todo} />
        <Button
          disabled={isBusy}
          onClick={() => {
            void deleteTodo();
          }}
          size="sm"
          type="button"
          variant="destructive"
        >
          삭제
        </Button>
      </div>
    </li>
  );
}
