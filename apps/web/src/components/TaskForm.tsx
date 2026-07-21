import { useState } from 'react';

interface TaskFormProps {
  onCreate: (input: { title: string; description: string | null; dueDate: string | null }) => Promise<void>;
}

export function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim().length === 0) {
      setErrorMessage('タイトルは必須です');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await onCreate({
        title,
        description: description.trim() ? description : null,
        dueDate: dueDate || null,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'タスク作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        タイトル
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label>
        説明
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label>
        期限
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      </label>
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? '保存中...' : 'タスクを追加'}</button>
    </form>
  );
}