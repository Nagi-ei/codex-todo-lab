import type { Todo } from "@/features/todos/types/todo";

export type TodoActionErrorCode =
  | "validation_failed"
  | "unauthorized"
  | "not_found"
  | "db_read_failed"
  | "db_insert_failed"
  | "db_update_failed"
  | "db_delete_failed"
  | "unknown";

export type TodoActionMessageKey =
  | "todo.validation_failed"
  | "todo.unauthorized"
  | "todo.not_found"
  | "todo.db_read_failed"
  | "todo.db_insert_failed"
  | "todo.db_update_failed"
  | "todo.db_delete_failed"
  | "todo.unknown";

export type TodoTitleFieldErrorKey =
  | "title_required"
  | "title_too_long"
  | "title_invalid";

export type TodoActionErrorDetails = {
  fieldErrors?: {
    title?: TodoTitleFieldErrorKey[];
  };
  reason?: string;
  providerMessage?: string;
};

export type TodoActionErrorResponse = {
  transportStatus: 200;
  requestId: string;
  details?: TodoActionErrorDetails;
};

export type TodoActionResult =
  | {
      ok: true;
      todo: Todo;
    }
  | {
      ok: false;
      code: TodoActionErrorCode;
      messageKey: TodoActionMessageKey;
      message: string;
      response: TodoActionErrorResponse;
    };
