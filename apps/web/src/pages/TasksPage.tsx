import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiFetch, ApiClientError } from '../api/client'

type TaskItem = {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  createdAt: string
}

const createSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
})

type CreateForm = z.infer<typeof createSchema>

export function TasksPage() {
  const [items, setItems] = useState<TaskItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateForm>({ resolver: zodResolver(createSchema) })

  const load = useCallback(async () => {
    const res = await apiFetch<{ items: TaskItem[] }>('/api/tasks')
    setItems(res.items)
  }, [])

  useEffect(() => {
    void load().catch((e) => {
      setError(e instanceof ApiClientError ? e.message : '読み込みに失敗しました')
    })
  }, [load])

  const onCreate = handleSubmit(async (values) => {
    setError(null)
    try {
      await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: values.title,
          description: values.description || null,
        }),
      })
      reset()
      setModalOpen(false)
      await load()
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : '作成に失敗しました')
    }
  })

  async function changeStatus(id: string, status: TaskItem['status']) {
    setError(null)
    try {
      await apiFetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      await load()
    } catch (e) {
      if (e instanceof ApiClientError) setError(e.message)
      else if (e instanceof Error) setError(e.message)
      else setError('更新に失敗しました')
    }
  }

  async function confirmDelete() {
    if (!confirmId) return
    try {
      await apiFetch(`/api/tasks/${confirmId}`, { method: 'DELETE' })
      setConfirmId(null)
      await load()
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : '削除に失敗しました')
    }
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1>タスク管理</h1>
        <button type="button" onClick={() => setModalOpen(true)}>
          新規作成
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {items.length === 0 ? (
        <p>タスクはありません</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>タイトル</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.status}</td>
                <td className="actions">
                  {t.status === 'todo' && (
                    <button type="button" onClick={() => void changeStatus(t.id, 'in_progress')}>
                      着手
                    </button>
                  )}
                  {t.status === 'in_progress' && (
                    <>
                      <button type="button" onClick={() => void changeStatus(t.id, 'done')}>
                        完了
                      </button>
                      <button type="button" onClick={() => void changeStatus(t.id, 'todo')}>
                        戻す
                      </button>
                    </>
                  )}
                  <button type="button" onClick={() => setConfirmId(t.id)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <form onSubmit={onCreate}>
            <h2>タスク作成</h2>
            <label>
              タイトル
              <input {...register('title')} />
            </label>
            {errors.title && <p role="alert">{errors.title.message}</p>}
            <label>
              説明
              <textarea {...register('description')} />
            </label>
            <div className="actions">
              <button type="button" onClick={() => setModalOpen(false)}>
                キャンセル
              </button>
              <button type="submit" disabled={isSubmitting}>
                作成
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmId && (
        <div className="modal" role="dialog" aria-modal="true">
          <p>このタスクを削除しますか？</p>
          <div className="actions">
            <button type="button" onClick={() => setConfirmId(null)}>
              キャンセル
            </button>
            <button type="button" onClick={() => void confirmDelete()}>
              削除
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
