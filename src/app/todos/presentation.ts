import type { TodoActionResult } from "./action-types";

export function getTodoActionErrorMessage(result: Extract<TodoActionResult, { ok: false }>): string {
  if (result.code === "validation_failed") {
    const titleError = result.fieldErrors?.title?.[0];

    if (titleError) {
      return titleError;
    }
  }

  return result.message;
}
