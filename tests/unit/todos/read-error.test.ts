import { describe, expect, it } from "vitest";

import { getTodoReadErrorMessage } from "../../../src/features/todos/presentation/read-error";

describe("getTodoReadErrorMessage", () => {
  it("returns null when there is no read error", () => {
    expect(getTodoReadErrorMessage(null)).toBeNull();
  });

  it("maps a table-missing provider message to a readable message", () => {
    const message = getTodoReadErrorMessage(
      "Could not find the table 'public.todos' in the schema cache",
    );

    expect(message).toBe("할 일 테이블을 찾을 수 없습니다. Supabase migration 적용 상태를 확인해 주세요.");
  });

  it("falls back to a generic read error message", () => {
    const message = getTodoReadErrorMessage("unexpected");

    expect(message).toBe("할 일 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
  });
});
