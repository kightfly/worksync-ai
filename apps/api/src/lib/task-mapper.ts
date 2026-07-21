import type { Task } from '@ai-harness/domain';

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toTaskResponse(task: Task): TaskResponse {
  const props = task.toProps();
  return {
    id: props.id,
    title: props.title,
    description: props.description,
    status: props.status,
    dueDate: props.dueDate,
    createdAt: props.createdAt.toISOString(),
    updatedAt: props.updatedAt.toISOString(),
  };
}