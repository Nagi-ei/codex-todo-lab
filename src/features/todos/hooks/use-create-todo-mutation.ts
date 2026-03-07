"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createTodoAction } from "@/features/todos/actions/create-todo";
import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "@/features/todos/presentation/todo";
import type { CreateTodoInput } from "@/features/todos/types/todo";

type UseCreateTodoMutationOptions = {
  onSuccess?: () => void;
};

export function useCreateTodoMutation(options?: UseCreateTodoMutationOptions) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createTodoAction,
    onSuccess: (result) => {
      if (!result.ok) {
        const message = getTodoActionErrorMessage(result);
        const debugLabel = getTodoActionDebugLabel(result);
        setErrorMessage(message);
        toast.error(`${message} (${debugLabel})`);
        if (process.env.NODE_ENV !== "production") {
          console.error("[todo][create]", result);
        }
        return;
      }

      setErrorMessage(null);
      options?.onSuccess?.();
      router.refresh();
    },
  });

  return {
    createTodo: (input: CreateTodoInput) => mutation.mutateAsync(input),
    clearErrorMessage: () => setErrorMessage(null),
    errorMessage,
    isPending: mutation.isPending,
  };
}
