"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateTodoAction } from "@/features/todos/actions/update-todo";
import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "@/features/todos/presentation/todo";

type UseUpdateTodoMutationOptions = {
  onSuccess?: () => void;
};

export function useUpdateTodoMutation(
  todoId: string,
  options?: UseUpdateTodoMutationOptions,
) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (nextTitle: string) => updateTodoAction(todoId, { title: nextTitle }),
    onSuccess: (result) => {
      if (!result.ok) {
        const message = getTodoActionErrorMessage(result);
        const debugLabel = getTodoActionDebugLabel(result);
        setErrorMessage(message);
        toast.error(`${message} (${debugLabel})`);
        if (process.env.NODE_ENV !== "production") {
          console.error("[todo][update]", result);
        }
        return;
      }

      setErrorMessage(null);
      options?.onSuccess?.();
      router.refresh();
    },
  });

  return {
    clearErrorMessage: () => setErrorMessage(null),
    errorMessage,
    isPending: mutation.isPending,
    updateTodo: (nextTitle: string) => mutation.mutateAsync(nextTitle),
  };
}
