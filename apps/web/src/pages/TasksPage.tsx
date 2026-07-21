import { useEffect, useState } from 'react';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import {
  createTask,
  deleteTask,
  fetchTasks,
  type TaskItem,
  updateTask,
} from '../lib/api';

interface TasksPageProps {
  token: string;
  onUnauthorized: () => void;
}

export function TasksPage({ token, onUnauthorized }: TasksPageProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await fetchTasks(token);
        setTasks(result.tasks);
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

  return (
    <main>
      <h1>タスク一覧</h1>
      <TaskForm
        onCreate={async (input) => {
          const created = await createTask(token, input);
          setTasks((current) => [created, ...current]);
        }}
      />
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      {isLoading ? <p>読み込み中...</p> : null}
      {!isLoading ? (
        <TaskList
          tasks={tasks}
          onAdvance={async (task) => {
            const nextStatus = task.status === 'todo' ? 'in_progress' : 'done';
            const updated = await updateTask(token, task.id, { status: nextStatus });
            setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
          }}
          onDelete={async (task) => {
            await deleteTask(token, task.id);
            setTasks((current) => current.filter((item) => item.id !== task.id));
          }}
        />
      ) : null}
    </main>
  );
}