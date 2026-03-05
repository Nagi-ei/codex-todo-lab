import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTodoAction, updateTodoAction } from "../../../src/app/todos/actions";

const { mockCreateSupabaseServerClient } = vi.hoisted(() => ({
  mockCreateSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient,
}));

function createSupabaseMock(options?: {
  userId?: string | null;
  createRow?: {
    id: string;
    user_id: string;
    title: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  updateRow?: {
    id: string;
    user_id: string;
    title: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  } | null;
}) {
  const userId =
    options && "userId" in options ? options.userId : "user-1";
  const defaultRow = {
    id: "todo-1",
    user_id: "user-1",
    title: "Write tests",
    is_completed: false,
    created_at: "2026-03-06T00:00:00.000Z",
    updated_at: "2026-03-06T00:00:00.000Z",
  };
  const createRow =
    options && "createRow" in options ? options.createRow : defaultRow;
  const updateRow =
    options && "updateRow" in options ? options.updateRow : createRow;

  const createSingle = vi.fn().mockResolvedValue({ data: createRow, error: null });
  const createSelect = vi.fn().mockReturnValue({ single: createSingle });
  const createInsert = vi.fn().mockReturnValue({ select: createSelect });

  const updateSingle = vi.fn().mockResolvedValue({ data: updateRow, error: null });
  const updateSelect = vi.fn().mockReturnValue({ maybeSingle: updateSingle });
  const updateEqUser = vi.fn().mockReturnValue({ select: updateSelect });
  const updateEqId = vi.fn().mockReturnValue({ eq: updateEqUser });
  const updateUpdate = vi.fn().mockReturnValue({ eq: updateEqId });

  const from = vi.fn((table: string) => {
    if (table !== "todos") {
      throw new Error(`Unexpected table: ${table}`);
    }

    return {
      insert: createInsert,
      update: updateUpdate,
    };
  });

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userId ? { id: userId } : null },
      }),
    },
    from,
    spies: {
      createInsert,
      updateUpdate,
      updateEqId,
      updateEqUser,
    },
  };
}

describe("todo create/update actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation error when title is blank", async () => {
    const supabase = createSupabaseMock();
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await createTodoAction({ title: "   " });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("validation_failed");
      expect(result.response.transportStatus).toBe(200);
      expect(typeof result.response.requestId).toBe("string");
      expect(result.response.details?.fieldErrors?.title?.[0]).toBeTruthy();
    }
  });

  it("returns unauthorized when user does not exist", async () => {
    const supabase = createSupabaseMock({ userId: null });
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await createTodoAction({ title: "Write tests" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("unauthorized");
      expect(result.response.transportStatus).toBe(200);
      expect(typeof result.response.requestId).toBe("string");
      expect(result.response.details?.reason).toBe("missing_user");
    }
  });

  it("creates todo with trimmed title", async () => {
    const supabase = createSupabaseMock();
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await createTodoAction({ title: "  Write tests  " });

    expect(supabase.spies.createInsert).toHaveBeenCalledWith({
      user_id: "user-1",
      title: "Write tests",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.todo.title).toBe("Write tests");
    }
  });

  it("returns db_insert_failed when insert does not return row", async () => {
    const supabase = createSupabaseMock({ createRow: null });
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await createTodoAction({ title: "Write tests" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("db_insert_failed");
      expect(result.response.details?.reason).toBe("todos_insert_failed");
    }
  });

  it("returns not_found when update target does not exist", async () => {
    const supabase = createSupabaseMock({ updateRow: null });
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await updateTodoAction("missing-id", { title: "x" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("not_found");
      expect(result.response.transportStatus).toBe(200);
      expect(typeof result.response.requestId).toBe("string");
      expect(result.response.details?.reason).toBe("todo_not_found");
    }
  });

  it("updates todo title", async () => {
    const supabase = createSupabaseMock({
      updateRow: {
        id: "todo-1",
        user_id: "user-1",
        title: "Updated title",
        is_completed: false,
        created_at: "2026-03-06T00:00:00.000Z",
        updated_at: "2026-03-06T01:00:00.000Z",
      },
    });
    mockCreateSupabaseServerClient.mockResolvedValue(supabase);

    const result = await updateTodoAction("todo-1", { title: "  Updated title  " });

    expect(supabase.spies.updateUpdate).toHaveBeenCalledWith({
      title: "Updated title",
      updated_at: expect.any(String),
    });
    expect(supabase.spies.updateEqId).toHaveBeenCalledWith("id", "todo-1");
    expect(supabase.spies.updateEqUser).toHaveBeenCalledWith("user_id", "user-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.todo.title).toBe("Updated title");
    }
  });
});
