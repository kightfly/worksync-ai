import type { TaskItem } from '../lib/api';

interface TaskListProps {
  tasks: TaskItem[];
  onAdvance: (task: TaskItem) => Promise<void>;
  onDelete: (task: TaskItem) => Promise<void>;
  onSelect?: (task: TaskItem) => void;
  selectedTaskId?: string | null;
}

function nextStatus(status: TaskItem['status']): TaskItem['status'] | null {
  if (status === 'todo') return 'in_progress';
  if (status === 'in_progress') return 'done';
  return null;
}

function statusLabel(status: TaskItem['status']): string {
  if (status === 'todo') return 'todo';
  if (status === 'in_progress') return 'in_progress';
  return 'done';
}

export function TaskList({ tasks, onAdvance, onDelete, onSelect, selectedTaskId }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="muted">タスクはありません</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const next = nextStatus(task.status);
        return (
          <li
            className={`task-item ${selectedTaskId === task.id ? 'task-item-selected' : ''}`}
            key={task.id}
          >
            <div className="task-item-head">
              <div>
                <h3 className="task-title">{task.title}</h3>
                <p className="muted">{task.description ?? '説明はありません'}</p>
              </div>
              <span className={`status-badge status-${task.status}`}>{statusLabel(task.status)}</span>
            </div>
            <p>期限: {task.dueDate ?? '未設定'}</p>
            <div className="inline-row">
              <button className="btn btn-ghost" type="button" onClick={() => onSelect?.(task)}>
                詳細
              </button>
              {next ? (
                <button className="btn btn-primary" type="button" onClick={() => void onAdvance(task)}>
                  {next === 'in_progress' ? '開始' : '完了'}
                </button>
              ) : null}
              <button className="btn btn-danger" type="button" onClick={() => void onDelete(task)}>
                削除
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}