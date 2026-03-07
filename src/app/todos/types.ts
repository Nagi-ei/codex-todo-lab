export type Todo = {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoFilter = "all" | "active" | "completed";

export type CreateTodoInput = {
  title: string;
};

export type UpdateTodoInput = {
  title?: string;
};
