import { describe, expect, it } from "vitest";

import { getTodoActionErrorMessage } from "../../../src/app/todos/presentation";

describe("getTodoActionErrorMessage", () => {
  it("prefers title field error for validation failures", () => {
    const message = getTodoActionErrorMessage({
      ok: false,
      code: "validation_failed",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        title: ["제목을 입력해 주세요."],
      },
    });

    expect(message).toBe("제목을 입력해 주세요.");
  });

  it("falls back to generic action message", () => {
    const message = getTodoActionErrorMessage({
      ok: false,
      code: "unknown",
      message: "요청을 처리하지 못했습니다.",
    });

    expect(message).toBe("요청을 처리하지 못했습니다.");
  });
});
