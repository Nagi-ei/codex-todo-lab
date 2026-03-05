import type { Todo } from "./types";

export type TodoActionErrorCode =
  | "validation_failed"
  | "unauthorized"
  | "not_found"
  | "unknown";

export type TodoActionResult =
  | {
      ok: true;
      todo: Todo;
    }
  | {
      ok: false;
      code: TodoActionErrorCode;
      message: string;
      fieldErrors?: {
        title?: string[];
      };
    };
