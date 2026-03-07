"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateTodoMutation } from "@/features/todos/hooks/use-update-todo-mutation";
import type { Todo } from "@/features/todos/types/todo";

type TodoEditDialogProps = {
  todo: Todo;
};

export function TodoEditDialog({ todo }: TodoEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const { clearErrorMessage, errorMessage, isPending, updateTodo } = useUpdateTodoMutation(
    todo.id,
    {
      onSuccess: () => {
        setOpen(false);
      },
    },
  );

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle);
    clearErrorMessage();
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateTodo(title);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setTitle(todo.title);
      clearErrorMessage();
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button" variant="outline">
          수정
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>할 일 수정</DialogTitle>
          <DialogDescription>제목을 수정한 뒤 저장하세요.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="text-sm font-medium" htmlFor={`todo-edit-title-${todo.id}`}>
            제목
          </label>
          <Input
            id={`todo-edit-title-${todo.id}`}
            name="title"
            onChange={(event) => handleTitleChange(event.currentTarget.value)}
            value={title}
          />
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <DialogFooter>
            <Button disabled={isPending} type="submit">
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
