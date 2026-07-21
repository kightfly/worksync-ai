import type { TaskItem } from '../lib/api';

interface TaskListProps {
  tasks: TaskItem[];
  onAdvance: (task: TaskItem) => Promise<void>;
  onDelete: (task: TaskItem) => Promise<void>;
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

export function TaskList({ tasks, onAdvance, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>タスクはありません</p>;
  }

  return (
    <ul>
      {tasks.map((task) => {
        const next = nextStatus(task.status);
        return (
          <li key={task.id}>
            <strong>{task.title}</strong>
            <p>{task.description ?? '説明はありません'}</p>
            <p>状態: {statusLabel(task.status)}</p>
            <p>期限: {task.dueDate ?? '未設定'}</p>
            {next ? (
              <button type="button" onClick={() => void onAdvance(task)}>
                {next === 'in_progress' ? '開始' : '完了'}
              </button>
            ) : null}
            <button type="button" onClick={() => void onDelete(task)}>削除</button>
          </li>
        );
      })}
    </ul>
  );
}