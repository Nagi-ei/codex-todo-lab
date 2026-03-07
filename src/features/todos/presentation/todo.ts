import type { TodoActionResult } from "@/app/todos/action-types";
import type { Todo, TodoRow } from "@/features/todos/types/todo";

const TODO_MESSAGE_KEY_MAP = {
  "todo.validation_failed": "입력값을 확인해 주세요.",
  "todo.unauthorized": "로그인이 필요합니다.",
  "todo.not_found": "할 일을 찾을 수 없습니다.",
  "todo.db_read_failed": "할 일을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
  "todo.db_insert_failed": "할 일을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  "todo.db_update_failed": "할 일을 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  "todo.db_delete_failed": "할 일을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  "todo.unknown": "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
} as const;

const TODO_TITLE_FIELD_ERROR_MAP = {
  title_required: "제목을 입력해 주세요.",
  title_too_long: "제목은 200자 이하여야 합니다.",
  title_invalid: "제목을 확인해 주세요.",
} as const;

export function mapTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isCompleted: row.is_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getTodoActionErrorMessage(result: Extract<TodoActionResult, { ok: false }>): string {
  if (result.code === "validation_failed") {
    const titleErrorKey = result.response.details?.fieldErrors?.title?.[0];

    if (titleErrorKey) {
      return TODO_TITLE_FIELD_ERROR_MAP[titleErrorKey];
    }
  }

  return TODO_MESSAGE_KEY_MAP[result.messageKey] ?? result.message;
}

export function getTodoActionDebugLabel(result: Extract<TodoActionResult, { ok: false }>): string {
  return `${result.code} · ${result.response.requestId}`;
}
