import type { Task } from '@ai-harness/domain';
import type { TaskRepository } from '@ai-harness/infrastructure';
import { NotFoundError } from '../errors/not-found-error.js';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema.js';

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async listTasks(userId: string, status?: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(
      userId,
      status ? { status } : undefined,
    );
  }

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    return this.taskRepository.create({
      userId,
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
    });
  }

  async updateTask(
    userId: string,
    taskId: string,
    input: UpdateTaskInput,
  ): Promise<Task> {
    const existing = await this.taskRepository.findById(taskId, userId);
    if (!existing) {
      throw new NotFoundError('タスクが見つかりません');
    }

    try {
      return await this.taskRepository.update(taskId, userId, {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'タスクが見つかりません') {
        throw new NotFoundError('タスクが見つかりません');
      }
      throw error;
    }
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const existing = await this.taskRepository.findById(taskId, userId);
    if (!existing) {
      throw new NotFoundError('タスクが見つかりません');
    }
    await this.taskRepository.delete(taskId, userId);
  }
}