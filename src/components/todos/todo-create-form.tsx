"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createTodoAction } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "@/features/todos/presentation/todo";

export function TodoCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
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

      setTitle("");
      setErrorMessage(null);
      router.refresh();
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutation.mutateAsync({ title });
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <label className="text-sm font-medium" htmlFor="todo-create-title">
        새 할 일
      </label>
      <div className="flex gap-2">
        <Input
          id="todo-create-title"
          name="title"
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="할 일을 입력하세요"
          value={title}
        />
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "추가 중..." : "추가"}
        </Button>
      </div>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </form>
  );
}
