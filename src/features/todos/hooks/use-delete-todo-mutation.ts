"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTodoAction } from "@/features/todos/actions/delete-todo";
import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "@/features/todos/presentation/todo";

export function useDeleteTodoMutation(todoId: string) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => deleteTodoAction(todoId),
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

  return {
    deleteTodo: () => mutation.mutateAsync(),
    isPending: mutation.isPending,
  };
}
