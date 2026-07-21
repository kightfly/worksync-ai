import { z } from 'zod';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const attendanceQuerySchema = z.object({
  startDate: z
    .string({ required_error: 'startDate は必須です' })
    .regex(datePattern, 'startDate は YYYY-MM-DD 形式で入力してください'),
  endDate: z
    .string({ required_error: 'endDate は必須です' })
    .regex(datePattern, 'endDate は YYYY-MM-DD 形式で入力してください'),
});

export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
