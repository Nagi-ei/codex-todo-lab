"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toggleTodoAction } from "@/features/todos/actions/toggle-todo";
import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "@/features/todos/presentation/todo";

export function useToggleTodoMutation(todoId: string) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => toggleTodoAction(todoId),
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

  return {
    isPending: mutation.isPending,
    toggleTodo: () => mutation.mutateAsync(),
  };
}
