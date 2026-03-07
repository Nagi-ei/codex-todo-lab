"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateTodoAction } from "@/app/todos/actions";
import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "@/app/todos/presentation";
import type { Todo } from "@/app/todos/types";
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

type TodoEditDialogProps = {
  todo: Todo;
};

export function TodoEditDialog({ todo }: TodoEditDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (nextTitle: string) => updateTodoAction(todo.id, { title: nextTitle }),
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
      setOpen(false);
      router.refresh();
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutation.mutateAsync(title);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setTitle(todo.title);
      setErrorMessage(null);
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
            onChange={(event) => setTitle(event.currentTarget.value)}
            value={title}
          />
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <DialogFooter>
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
