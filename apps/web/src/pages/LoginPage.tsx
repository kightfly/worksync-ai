import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { ApiClientError } from '../api/client'

const schema = z.object({
  email: z.string().email('メールアドレスの形式が正しくありません'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
})

type Form = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      await login(values.email, values.password)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      if (e instanceof ApiClientError) setServerError(e.message)
      else setServerError('メールアドレスまたはパスワードが正しくありません')
    }
  })

  return (
    <main className="page login-page">
      <h1>ログイン</h1>
      <form onSubmit={onSubmit} noValidate>
        <label>
          メールアドレス
          <input type="email" autoComplete="username" {...register('email')} />
        </label>
        {errors.email && <p role="alert">{errors.email.message}</p>}
        <label>
          パスワード
          <input type="password" autoComplete="current-password" {...register('password')} />
        </label>
        {errors.password && <p role="alert">{errors.password.message}</p>}
        {serverError && <p role="alert">{serverError}</p>}
        <button type="submit" disabled={isSubmitting}>
          ログイン
        </button>
      </form>
    </main>
  )
}
