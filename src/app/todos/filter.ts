import type { TodoFilter } from "./types";

const TODO_FILTERS: ReadonlyArray<TodoFilter> = ["all", "active", "completed"];

export function parseTodoFilter(filter: string | undefined): TodoFilter {
  if (filter && TODO_FILTERS.includes(filter as TodoFilter)) {
    return filter as TodoFilter;
  }

  return "all";
}
