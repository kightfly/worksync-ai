import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { login, type AuthUser } from '../lib/api';

interface LoginPageProps {
  token: string | null;
  onLogin: (token: string, user: AuthUser) => void;
}

export function LoginPage({ token, onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <main>
      <h1>勤怠・タスク管理</h1>
      <section aria-label="ログイン">
        <h2>ログイン</h2>
        <LoginForm
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onSubmit={async (values) => {
            setErrorMessage(null);
            setIsSubmitting(true);
            try {
              const result = await login(values.email, values.password);
              onLogin(result.token, result.user);
              const nextPath = (location.state as { from?: string } | null)?.from ?? '/tasks';
              navigate(nextPath, { replace: true });
            } catch (error) {
              setErrorMessage(
                error instanceof Error ? error.message : 'ログインに失敗しました',
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      </section>
    </main>
  );
}