import { describe, expect, it } from "vitest";

import {
  getTodoActionDebugLabel,
  getTodoActionErrorMessage,
} from "../../../src/app/todos/presentation";

describe("getTodoActionErrorMessage", () => {
  it("prefers title field error for validation failures", () => {
    const message = getTodoActionErrorMessage({
      ok: false,
      code: "validation_failed",
      message: "입력값을 확인해 주세요.",
      response: {
        transportStatus: 200,
        requestId: "req_1",
        details: {
          fieldErrors: {
            title: ["제목을 입력해 주세요."],
          },
        },
      },
    });

    expect(message).toBe("제목을 입력해 주세요.");
  });

  it("falls back to generic action message", () => {
    const message = getTodoActionErrorMessage({
      ok: false,
      code: "unknown",
      message: "요청을 처리하지 못했습니다.",
      response: {
        transportStatus: 200,
        requestId: "req_2",
      },
    });

    expect(message).toBe("요청을 처리하지 못했습니다.");
  });

  it("builds debug label from code and request id", () => {
    const label = getTodoActionDebugLabel({
      ok: false,
      code: "db_insert_failed",
      message: "할 일을 저장하지 못했습니다.",
      response: {
        transportStatus: 200,
        requestId: "req_3",
      },
    });

    expect(label).toBe("db_insert_failed · req_3");
  });
});
