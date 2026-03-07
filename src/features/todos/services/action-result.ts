import type {
  TodoActionErrorCode,
  TodoActionErrorDetails,
  TodoActionMessageKey,
  TodoActionResult,
  TodoTitleFieldErrorKey,
} from "@/app/todos/action-types";

export function createRequestId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function toErrorResult(input: {
  code: TodoActionErrorCode;
  messageKey: TodoActionMessageKey;
  message: string;
  requestId: string;
  details?: TodoActionErrorDetails;
}): TodoActionResult {
  return {
    ok: false,
    code: input.code,
    messageKey: input.messageKey,
    message: input.message,
    response: {
      transportStatus: 200,
      requestId: input.requestId,
      details: input.details,
    },
  };
}

export function toTitleFieldErrorKeys(error: {
  issues: Array<{ path: PropertyKey[]; code: string }>;
}): TodoTitleFieldErrorKey[] {
  const keys = new Set<TodoTitleFieldErrorKey>();

  for (const issue of error.issues) {
    const pathHasTitle = issue.path.some((segment) => segment === "title");
    if (!pathHasTitle) {
      continue;
    }

    if (issue.code === "too_small") {
      keys.add("title_required");
      continue;
    }

    if (issue.code === "too_big") {
      keys.add("title_too_long");
      continue;
    }

    keys.add("title_invalid");
  }

  if (keys.size === 0) {
    keys.add("title_invalid");
  }

  return Array.from(keys);
}
