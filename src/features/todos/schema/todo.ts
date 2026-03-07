import { z } from "zod";

export const todoTitleSchema = z
  .string()
  .trim()
  .min(1, "제목을 입력해 주세요.")
  .max(200, "제목은 200자 이하여야 합니다.");

export const createTodoSchema = z.object({
  title: todoTitleSchema,
});

export const updateTodoSchema = z
  .object({
    title: todoTitleSchema.optional(),
  })
  .refine((input) => input.title !== undefined, {
    message: "수정할 값을 입력해 주세요.",
  });
