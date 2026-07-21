import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスは必須です' })
    .min(1, 'メールアドレスは必須です')
    .email('メールアドレスの形式が正しくありません'),
  password: z
    .string({ required_error: 'パスワードは必須です' })
    .min(6, 'パスワードは6文字以上で入力してください'),
});

export type LoginInput = z.infer<typeof loginSchema>;