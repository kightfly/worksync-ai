import { useEffect, useMemo, useState } from 'react';
import { TaskForm } from '../components/TaskForm';
import { createTask, deleteTask, fetchTasks, type TaskItem, updateTask } from '../lib/api';

interface TasksPageProps {
  token: string;
  onUnauthorized: () => void;
}

export function TasksPage({ token, onUnauthorized }: TasksPageProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskItem['status']>('all');
  const [pageSize, setPageSize] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const result = await fetchTasks(token);
        setTasks(result.tasks);
        setSelectedTaskId((current) => current ?? result.tasks[0]?.id ?? null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'タスク取得に失敗しました';
        setErrorMessage(message);
        if (message.includes('認証')) {
          onUnauthorized();
        }
      } finally {
        setIsLoading(false);
      }
    };
    void run();
  }, [token, onUnauthorized]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, tasks]);

  const visibleTasks = filteredTasks.slice(0, pageSize);

  const startEditing = (task: TaskItem | null) => {
    if (!task) {
      return;
    }
    setEditingTaskId(task.id);
    setSelectedTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description ?? '');
    setEditDueDate(task.dueDate ?? '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDueDate('');
  };

  const removeTask = async (task: TaskItem) => {
    await deleteTask(token, task.id);
    setTasks((current) => {
      const nextTasks = current.filter((item) => item.id !== task.id);
      setSelectedTaskId(nextTasks[0]?.id ?? null);
      return nextTasks;
    });
    if (selectedTaskId === task.id) {
      cancelEditing();
      setIsDetailOpen(false);
    }
  };

  return (
    <main>
      <div className="page-header">
        <div>
          <p className="eyebrow">Task Management</p>
          <h1 className="hero-title">タスク管理</h1>
          <p className="muted">一覧は表形式で確認し、詳細・編集・新規はポップアップで操作します。</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setIsCreateOpen(true)}>
          ＋ 新規
        </button>
      </div>

      {errorMessage ? <p role="alert" className="alert">{errorMessage}</p> : null}
      {isLoading ? <p className="muted">読み込み中...</p> : null}

      {!isLoading ? (
        <>
          <section className="card">
            <div className="section-head">
              <div>
                <h2 className="card-title">フィルター条件</h2>
              </div>
            </div>
            <div className="table-filter-bar">
              <label className="field-label table-filter-search">
                <span className="sr-only">検索</span>
                <input
                  className="field"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="タイトル、説明で検索"
                />
              </label>
              <label className="field-label table-filter-select">
                状態
                <select
                  className="field"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'all' | TaskItem['status'])}
                >
                  <option value="all">すべて</option>
                  <option value="todo">todo</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </select>
              </label>
            </div>
          </section>

          <section className="card" id="task-list-section">
            <div className="section-head">
              <div>
                <h2 className="card-title">タスク一覧（{filteredTasks.length}件）</h2>
              </div>
              <div className="inline-row">
                <span className="muted">表示件数</span>
                <select
                  className="field table-size-select"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                >
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                </select>
              </div>
            </div>

            {visibleTasks.length === 0 ? <p className="muted">該当するタスクはありません。</p> : null}

            {visibleTasks.length > 0 ? (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>タイトル</th>
                      <th>説明</th>
                      <th>状態</th>
                      <th>期限</th>
                      <th>更新日</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTasks.map((task) => (
                      <tr
                        className={selectedTaskId === task.id ? 'table-row-selected' : ''}
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        <td>{task.title}</td>
                        <td>{task.description ?? '説明なし'}</td>
                        <td>
                          <span className={`status-badge status-${task.status}`}>{task.status}</span>
                        </td>
                        <td>{task.dueDate ?? '未設定'}</td>
                        <td>{new Date(task.updatedAt).toLocaleDateString('ja-JP')}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              aria-label="詳細"
                              className="icon-action-button"
                              type="button"
                              onClick={() => {
                                setSelectedTaskId(task.id);
                                setIsDetailOpen(true);
                              }}
                            >
                              👁
                            </button>
                            <button
                              aria-label="編集"
                              className="icon-action-button"
                              type="button"
                              onClick={() => startEditing(task)}
                            >
                              ✏️
                            </button>
                            {task.status !== 'done' ? (
                              <button
                                aria-label={task.status === 'todo' ? '開始' : '完了'}
                                className="icon-action-button"
                                type="button"
                                onClick={() => {
                                  void (async () => {
                                    const nextStatus = task.status === 'todo' ? 'in_progress' : 'done';
                                    const updated = await updateTask(token, task.id, { status: nextStatus });
                                    setTasks((current) =>
                                      current.map((item) => (item.id === task.id ? updated : item)),
                                    );
                                    setSelectedTaskId(updated.id);
                                  })();
                                }}
                              >
                                {task.status === 'todo' ? '▶️' : '✅'}
                              </button>
                            ) : null}
                            <button
                              aria-label="削除"
                              className="icon-action-button icon-action-danger"
                              type="button"
                              onClick={() => {
                                void removeTask(task);
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {isCreateOpen ? (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2 className="card-title">新規タスク</h2>
                <p className="muted">新しいタスクを追加します。</p>
              </div>
              <button className="modal-close" type="button" onClick={() => setIsCreateOpen(false)}>
                ×
              </button>
            </div>
            <TaskForm
              onCreate={async (input) => {
                const created = await createTask(token, input);
                setTasks((current) => [created, ...current]);
                setSelectedTaskId(created.id);
                setIsCreateOpen(false);
              }}
            />
          </div>
        </div>
      ) : null}

      {isDetailOpen && selectedTask ? (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2 className="card-title">詳細</h2>
                <p className="muted">選択したタスクの内容です。</p>
              </div>
              <button className="modal-close" type="button" onClick={() => setIsDetailOpen(false)}>
                ×
              </button>
            </div>
            <div className="detail-panel">
              <div className="inline-row">
                <span className={`status-badge status-${selectedTask.status}`}>{selectedTask.status}</span>
                {selectedTask.dueDate ? <span className="meta-chip">期限 {selectedTask.dueDate}</span> : null}
              </div>
              <h3 className="task-title">{selectedTask.title}</h3>
              <p className="muted">{selectedTask.description ?? '説明はありません'}</p>
              <div className="inline-row">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    startEditing(selectedTask);
                  }}
                >
                  編集
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedTask && editingTaskId === selectedTask.id ? (
        <div className="modal-overlay" onClick={cancelEditing}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2 className="card-title">編集</h2>
                <p className="muted">選択したタスクを更新します。</p>
              </div>
              <button className="modal-close" type="button" onClick={cancelEditing}>
                ×
              </button>
            </div>
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                void (async () => {
                  const updated = await updateTask(token, selectedTask.id, {
                    title: editTitle,
                    description: editDescription.trim() ? editDescription : null,
                    dueDate: editDueDate || null,
                  });
                  setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
                  setSelectedTaskId(updated.id);
                  cancelEditing();
                })();
              }}
            >
              <label className="field-label">
                タイトル
                <input className="field" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
              </label>
              <label className="field-label">
                説明
                <textarea
                  className="field textarea"
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                />
              </label>
              <label className="field-label">
                期限
                <input
                  className="field"
                  type="date"
                  value={editDueDate}
                  onChange={(event) => setEditDueDate(event.target.value)}
                />
              </label>
              <div className="inline-row">
                <button className="btn btn-primary" type="submit">
                  更新
                </button>
                <button className="btn btn-ghost" type="button" onClick={cancelEditing}>
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}