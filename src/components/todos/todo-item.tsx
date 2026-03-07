"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTodoAction, toggleTodoAction } from "@/app/todos/actions";
import { TodoEditDialog } from "@/components/todos/todo-edit-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "@/features/todos/presentation/todo";
import type { Todo } from "@/features/todos/types/todo";

type TodoItemProps = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItemProps) {
  const router = useRouter();

  const toggleMutation = useMutation({
    mutationFn: () => toggleTodoAction(todo.id),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(
          `${getTodoActionErrorMessage(result)} (${getTodoActionDebugLabel(result)})`,
        );
        if (process.env.NODE_ENV !== "production") {
          console.error("[todo][toggle]", result);
        }
        return;
      }

      router.refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTodoAction(todo.id),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(
          `${getTodoActionErrorMessage(result)} (${getTodoActionDebugLabel(result)})`,
        );
        if (process.env.NODE_ENV !== "production") {
          console.error("[todo][delete]", result);
        }
        return;
      }

      router.refresh();
    },
  });

  const isBusy = toggleMutation.isPending || deleteMutation.isPending;

  return (
    <li className="flex items-center justify-between rounded-md border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Checkbox
          aria-label={`${todo.title} 완료 상태 토글`}
          checked={todo.isCompleted}
          disabled={isBusy}
          onCheckedChange={() => {
            void toggleMutation.mutateAsync();
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
            void deleteMutation.mutateAsync();
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
