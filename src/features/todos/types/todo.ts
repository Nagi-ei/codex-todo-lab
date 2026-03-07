export type Todo = {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoRow = {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TodoFilter = "all" | "active" | "completed";

export type CreateTodoInput = {
  title: string;
};

export type UpdateTodoInput = {
  title?: string;
};
