"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTodoMutation } from "@/features/todos/hooks/use-create-todo-mutation";

export function TodoCreateForm() {
  const [title, setTitle] = useState("");
  const { createTodo, clearErrorMessage, errorMessage, isPending } = useCreateTodoMutation({
    onSuccess: () => {
      setTitle("");
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createTodo({ title });
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
          onChange={(event) => {
            setTitle(event.currentTarget.value);
            clearErrorMessage();
          }}
          placeholder="할 일을 입력하세요"
          value={title}
        />
        <Button disabled={isPending} type="submit">
          {isPending ? "추가 중..." : "추가"}
        </Button>
      </div>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </form>
  );
}
