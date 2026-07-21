import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTasks, type TaskItem } from '../lib/api';

interface DashboardPageProps {
  token: string;
  onUnauthorized: () => void;
}

function formatStatusLabel(status: TaskItem['status']): string {
  if (status === 'todo') return 'todo';
  if (status === 'in_progress') return 'in_progress';
  return 'done';
}

export function DashboardPage({ token, onUnauthorized }: DashboardPageProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await fetchTasks(token);
        setTasks(result.tasks.slice(0, 4));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'ダッシュボード取得に失敗しました';
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

  return (
    <main>
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="hero-title">ダッシュボード</h1>
          <p className="muted">最近のタスク状況と主要メニューへのショートカットを確認できます。</p>
        </div>
      </div>

      <section className="stats-grid">
        <article className="summary-card">
          <p className="summary-label">総タスク数</p>
          <p className="summary-value">{tasks.length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">todo</p>
          <p className="summary-value">{tasks.filter((task) => task.status === 'todo').length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">in_progress</p>
          <p className="summary-value">{tasks.filter((task) => task.status === 'in_progress').length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">done</p>
          <p className="summary-value">{tasks.filter((task) => task.status === 'done').length}</p>
        </article>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h2 className="card-title">業務ショートカット</h2>
            <p className="muted">よく使う画面へすぐに移動できます。</p>
          </div>
          <div className="inline-row">
            <Link className="btn btn-primary" to="/tasks">
              タスク管理
            </Link>
            <Link className="btn btn-ghost" to="/attendance">
              打刻一覧
            </Link>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h2 className="card-title">最近のタスク</h2>
            <p className="muted">現在のカード表示はダッシュボードのプレビューとして利用します。</p>
          </div>
          <Link className="btn btn-ghost" to="/tasks">
            タスク一覧へ
          </Link>
        </div>

        {errorMessage ? <p className="alert">{errorMessage}</p> : null}
        {isLoading ? <p className="muted">読み込み中...</p> : null}
        {!isLoading && tasks.length === 0 ? <p className="muted">タスクはありません</p> : null}

        {tasks.length > 0 ? (
          <div className="dashboard-task-grid">
            {tasks.map((task) => (
              <article className="dashboard-task-card" key={task.id}>
                <div className="inline-row">
                  <span className={`status-badge status-${task.status}`}>
                    {formatStatusLabel(task.status)}
                  </span>
                  {task.dueDate ? <span className="meta-chip">期限 {task.dueDate}</span> : null}
                </div>
                <h3 className="task-title">{task.title}</h3>
                <p className="muted">{task.description ?? '説明はありません'}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
