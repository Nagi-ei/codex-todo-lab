import type { Todo } from "./types";

export type TodoActionErrorCode =
  | "validation_failed"
  | "unauthorized"
  | "not_found"
  | "db_read_failed"
  | "db_insert_failed"
  | "db_update_failed"
  | "db_delete_failed"
  | "unknown";

export type TodoActionErrorDetails = {
  fieldErrors?: {
    title?: string[];
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
      message: string;
      response: TodoActionErrorResponse;
    };
