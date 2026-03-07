import { describe, expect, it } from "vitest";

import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "../../../src/features/todos/presentation/todo";

describe("getTodoActionErrorMessage", () => {
  it("prefers title field error for validation failures", () => {
    const message = getTodoActionErrorMessage({
      ok: false,
      code: "validation_failed",
      messageKey: "todo.validation_failed",
      message: "Validation failed.",
      response: {
        transportStatus: 200,
        requestId: "req_1",
        details: {
          fieldErrors: {
            title: ["title_required"],
          },
        },
      },
    });

    expect(message).toBe("제목을 입력해 주세요.");
  });

  it("maps message key to localized message", () => {
    const message = getTodoActionErrorMessage({
      ok: false,
      code: "db_insert_failed",
      messageKey: "todo.db_insert_failed",
      message: "Failed to save todo.",
      response: {
        transportStatus: 200,
        requestId: "req_2",
      },
    });

    expect(message).toBe("할 일을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  });

  it("builds debug label from code and request id", () => {
    const label = getTodoActionDebugLabel({
      ok: false,
      code: "db_insert_failed",
      messageKey: "todo.db_insert_failed",
      message: "Failed to save todo.",
      response: {
        transportStatus: 200,
        requestId: "req_3",
      },
    });

    expect(label).toBe("db_insert_failed · req_3");
  });
});
