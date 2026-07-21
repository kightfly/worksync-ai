import { InvalidStateTransitionError } from '../errors/invalid-state-transition-error.js';
import { TaskLockedError } from '../errors/task-locked-error.js';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in_progress'],
  in_progress: ['done', 'todo'],
  done: [],
};

const TITLE_MAX_LENGTH = 255;

export interface CreateTaskParams {
  userId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskProps {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function assertValidTitle(title: string): string {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    throw new Error('タイトルは必須です');
  }
  if (trimmed.length > TITLE_MAX_LENGTH) {
    throw new Error('タイトルは255文字以内で入力してください');
  }
  return trimmed;
}

function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export class Task {
  readonly id: string;
  readonly userId: string;
  private _title: string;
  private _description: string | null;
  private _status: TaskStatus;
  private _dueDate: string | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TaskProps) {
    this.id = props.id;
    this.userId = props.userId;
    this._title = props.title;
    this._description = props.description;
    this._status = props.status;
    this._dueDate = props.dueDate;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(params: CreateTaskParams): Task {
    const now = params.createdAt ?? new Date();
    return new Task({
      id: params.id ?? crypto.randomUUID(),
      userId: params.userId,
      title: assertValidTitle(params.title),
      description: params.description ?? null,
      status: 'todo',
      dueDate: params.dueDate ?? null,
      createdAt: now,
      updatedAt: params.updatedAt ?? now,
    });
  }

  static reconstitute(props: TaskProps): Task {
    return new Task({
      ...props,
      title: assertValidTitle(props.title),
    });
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get dueDate(): string | null {
    return this._dueDate;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toProps(): TaskProps {
    return {
      id: this.id,
      userId: this.userId,
      title: this._title,
      description: this._description,
      status: this._status,
      dueDate: this._dueDate,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private assertMutable(): void {
    if (this._status === 'done') {
      throw new TaskLockedError();
    }
  }

  transitionTo(nextStatus: TaskStatus): void {
    if (this._status === nextStatus) {
      return;
    }
    if (!canTransition(this._status, nextStatus)) {
      throw new InvalidStateTransitionError();
    }
    this._status = nextStatus;
    this._updatedAt = new Date();
  }

  updateTitle(title: string): void {
    this.assertMutable();
    this._title = assertValidTitle(title);
    this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this.assertMutable();
    this._description = description;
    this._updatedAt = new Date();
  }
}