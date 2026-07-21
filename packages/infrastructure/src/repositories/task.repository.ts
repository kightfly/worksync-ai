import { Task, type TaskStatus } from '@ai-harness/domain';
import { and, desc, eq } from 'drizzle-orm';
import { tasks } from '../db/schema.js';
import type { CreateTaskData, DbClient, TaskFilters, UpdateTaskData } from './types.js';

function toDomain(row: typeof tasks.$inferSelect): Task {
  return Task.reconstitute({
    id: row.id,
    userId: row.userId,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    dueDate: row.dueDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class TaskRepository {
  constructor(private readonly db: DbClient) {}

  async withTransaction<T>(
    fn: (repo: TaskRepository) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (tx) => fn(new TaskRepository(tx)));
  }

  async findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]> {
    const conditions = [eq(tasks.userId, userId)];
    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status));
    }

    const rows = await this.db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.createdAt));

    return rows.map(toDomain);
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const [row] = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async create(data: CreateTaskData): Promise<Task> {
    const task = Task.create({
      id: data.id,
      userId: data.userId,
      title: data.title,
      description: data.description ?? null,
      dueDate: data.dueDate ?? null,
    });

    if (data.status && data.status !== 'todo') {
      task.transitionTo(data.status as TaskStatus);
    }

    const props = task.toProps();
    const [row] = await this.db
      .insert(tasks)
      .values({
        id: props.id,
        userId: props.userId,
        title: props.title,
        description: props.description,
        status: props.status,
        dueDate: props.dueDate,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      })
      .returning();

    if (!row) {
      throw new Error('タスクの作成に失敗しました');
    }
    return toDomain(row);
  }

  async save(task: Task): Promise<Task> {
    const props = task.toProps();
    const [row] = await this.db
      .update(tasks)
      .set({
        title: props.title,
        description: props.description,
        status: props.status,
        dueDate: props.dueDate,
        updatedAt: props.updatedAt,
      })
      .where(and(eq(tasks.id, props.id), eq(tasks.userId, props.userId)))
      .returning();

    if (!row) {
      throw new Error('タスクが見つかりません');
    }
    return toDomain(row);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTaskData,
  ): Promise<Task> {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('タスクが見つかりません');
    }

    if (data.title !== undefined) {
      existing.updateTitle(data.title);
    }
    if (data.description !== undefined) {
      existing.updateDescription(data.description);
    }
    if (data.status !== undefined) {
      existing.transitionTo(data.status as TaskStatus);
    }

    const [row] = await this.db
      .update(tasks)
      .set({
        ...(data.title !== undefined ? { title: existing.title } : {}),
        ...(data.description !== undefined
          ? { description: existing.description }
          : {}),
        ...(data.status !== undefined ? { status: existing.status } : {}),
        ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
        updatedAt: existing.updatedAt,
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (!row) {
      throw new Error('タスクの更新に失敗しました');
    }
    return toDomain(row);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  }
}