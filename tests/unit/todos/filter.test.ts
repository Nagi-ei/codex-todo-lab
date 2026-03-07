import { describe, expect, it } from "vitest";

import { parseTodoFilter } from "../../../src/features/todos/presentation/filter";

describe("parseTodoFilter", () => {
  it("returns all when input is undefined", () => {
    expect(parseTodoFilter(undefined)).toBe("all");
  });

  it("returns all for unknown filter", () => {
    expect(parseTodoFilter("something")).toBe("all");
  });

  it("accepts active/completed/all", () => {
    expect(parseTodoFilter("active")).toBe("active");
    expect(parseTodoFilter("completed")).toBe("completed");
    expect(parseTodoFilter("all")).toBe("all");
  });
});
