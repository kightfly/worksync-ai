import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().min(1, 'メールアドレスは必須です').email('メールアドレスの形式が正しくありません'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  errorMessage: string | null;
  isSubmitting: boolean;
}

export function LoginForm({ onSubmit, errorMessage, isSubmitting }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
      <label className="field-label">
        メールアドレス
        <input className="field" type="email" autoComplete="username" {...register('email')} />
      </label>
      {errors.email ? <p role="alert" className="alert">{errors.email.message}</p> : null}

      <label className="field-label">
        パスワード
        <input
          className="field"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
      </label>
      {errors.password ? <p role="alert" className="alert">{errors.password.message}</p> : null}

      {errorMessage ? <p role="alert" className="alert">{errorMessage}</p> : null}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}