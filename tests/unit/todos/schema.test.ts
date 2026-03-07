import { describe, expect, it } from "vitest";

import {
  createTodoSchema,
  todoTitleSchema,
  updateTodoSchema,
} from "../../../src/features/todos/schema/todo";

describe("todoTitleSchema", () => {
  it("accepts a trimmed non-empty title within 200 chars", () => {
    const result = todoTitleSchema.safeParse("  Buy milk  ");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Buy milk");
    }
  });

  it("rejects an empty title after trim", () => {
    const result = todoTitleSchema.safeParse("    ");

    expect(result.success).toBe(false);
  });

  it("rejects a title longer than 200 chars", () => {
    const result = todoTitleSchema.safeParse("a".repeat(201));

    expect(result.success).toBe(false);
  });
});

describe("todo input schemas", () => {
  it("parses create input with normalized title", () => {
    const result = createTodoSchema.safeParse({ title: "  Write tests  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ title: "Write tests" });
    }
  });

  it("allows partial update title", () => {
    const result = updateTodoSchema.safeParse({ title: "  Edit me  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ title: "Edit me" });
    }
  });

  it("rejects empty update payload", () => {
    const result = updateTodoSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
