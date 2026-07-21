import { z } from 'zod';

const taskStatusSchema = z.enum(['todo', 'in_progress', 'done']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().nullable().optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate は YYYY-MM-DD 形式で入力してください')
    .nullable()
    .optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1, 'タイトルは必須です').optional(),
    description: z.string().nullable().optional(),
    status: taskStatusSchema.optional(),
    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate は YYYY-MM-DD 形式で入力してください')
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: '更新する項目を指定してください',
  });

export const taskListQuerySchema = z.object({
  status: taskStatusSchema.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;