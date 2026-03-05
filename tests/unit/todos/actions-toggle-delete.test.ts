import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteTodoAction, toggleTodoAction } from "../../../src/app/todos/actions";

const { mockCreateSupabaseServerClient } = vi.hoisted(() => ({
  mockCreateSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient,
}));

type TodoRow = {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

function createSupabaseMock(options?: {
  userId?: string | null;
  toggleSource?: TodoRow | null;
  toggleResult?: TodoRow | null;
  deleteResult?: TodoRow | null;
}) {
  const userId = options && "userId" in options ? options.userId : "user-1";
  const baseRow: TodoRow = {
    id: "todo-1",
    user_id: "user-1",
    title: "Write tests",
    is_completed: false,
    created_at: "2026-03-06T00:00:00.000Z",
    updated_at: "2026-03-06T00:00:00.000Z",
  };

  const toggleSource =
    options && "toggleSource" in options ? options.toggleSource : baseRow;
  const toggleResult =
    options && "toggleResult" in options
      ? options.toggleResult
      : { ...baseRow, is_completed: true, updated_at: "2026-03-06T01:00:00.000Z" };
  const deleteResult =
    options && "deleteResult" in options ? options.deleteResult : baseRow;

  const readMaybeSingle = vi
    .fn()
    .mockResolvedValue({ data: toggleSource, error: null });
  const readEqUser = vi.fn().mockReturnValue({ maybeSingle: readMaybeSingle });
  const readEqId = vi.fn().mockReturnValue({ eq: readEqUser });
  const readSelect = vi.fn().mockReturnValue({ eq: readEqId });

  const toggleSingle = vi.fn().mockResolvedValue({ data: toggleResult, error: null });
  const toggleSelect = vi.fn().mockReturnValue({ single: toggleSingle });
  const toggleEqUser = vi.fn().mockReturnValue({ select: toggleSelect });
  const toggleEqId = vi.fn().mockReturnValue({ eq: toggleEqUser });
  const toggleUpdate = vi.fn().mockReturnValue({ eq: toggleEqId });

  const deleteSingle = vi.fn().mockResolvedValue({ data: deleteResult, error: null });
  const deleteSelect = vi.fn().mockReturnValue({ maybeSingle: deleteSingle });
  const deleteEqUser = vi.fn().mockReturnValue({ select: deleteSelect });
  const deleteEqId = vi.fn().mockReturnValue({ eq: deleteEqUser });
  const deleteDelete = vi.fn().mockReturnValue({ eq: deleteEqId });

  const from = vi.fn(() => ({
    select: readSelect,
    update: toggleUpdate,
    delete: deleteDelete,
  }));

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userId ? { id: userId } : null },
      }),
    },
    from,
    spies: {
      toggleUpdate,
      toggleEqId,
      toggleEqUser,
      deleteEqId,
      deleteEqUser,
    },
  };
}

describe("todo toggle/delete actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthorized on toggle when user is missing", async () => {
    const supabase = createSupabaseMock({ userId: null });
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await toggleTodoAction("todo-1");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("unauthorized");
      expect(result.response.transportStatus).toBe(200);
      expect(typeof result.response.requestId).toBe("string");
    }
  });

  it("returns not_found when toggle target is missing", async () => {
    const supabase = createSupabaseMock({ toggleSource: null });
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await toggleTodoAction("missing-id");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("not_found");
      expect(result.response.details?.reason).toBe("todo_not_found");
    }
  });

  it("toggles completion status", async () => {
    const supabase = createSupabaseMock();
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await toggleTodoAction("todo-1");

    expect(supabase.spies.toggleUpdate).toHaveBeenCalledWith({
      is_completed: true,
      updated_at: expect.any(String),
    });
    expect(supabase.spies.toggleEqId).toHaveBeenCalledWith("id", "todo-1");
    expect(supabase.spies.toggleEqUser).toHaveBeenCalledWith("user_id", "user-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.todo.isCompleted).toBe(true);
    }
  });

  it("returns not_found when delete target is missing", async () => {
    const supabase = createSupabaseMock({ deleteResult: null });
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await deleteTodoAction("missing-id");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("not_found");
      expect(result.response.details?.reason).toBe("todo_not_found");
    }
  });

  it("deletes todo", async () => {
    const supabase = createSupabaseMock();
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await deleteTodoAction("todo-1");

    expect(supabase.spies.deleteEqId).toHaveBeenCalledWith("id", "todo-1");
    expect(supabase.spies.deleteEqUser).toHaveBeenCalledWith("user_id", "user-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.todo.id).toBe("todo-1");
    }
  });
});
