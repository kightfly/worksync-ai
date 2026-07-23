export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskProps = {
  id: string
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  dueDate: string | null
}

const ALLOWED: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in_progress'],
  in_progress: ['done', 'todo'],
  done: [],
}

export class TaskDomainError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'TaskDomainError'
    this.code = code
  }
}

function assertTitle(title: string): string {
  const trimmed = title.trim()
  if (!trimmed) {
    throw new TaskDomainError('VALIDATION_ERROR', 'タイトルは必須です')
  }
  return trimmed
}

export class Task {
  private constructor(private props: TaskProps) {}

  static create(input: {
    title: string
    userId: string
    description?: string | null
    dueDate?: string | null
    id?: string
  }): Task {
    return new Task({
      id: input.id ?? crypto.randomUUID(),
      userId: input.userId,
      title: assertTitle(input.title),
      description: input.description ?? null,
      status: 'todo',
      dueDate: input.dueDate ?? null,
    })
  }

  static restore(props: TaskProps): Task {
    return new Task({ ...props, title: assertTitle(props.title) })
  }

  get id(): string {
    return this.props.id
  }
  get userId(): string {
    return this.props.userId
  }
  get title(): string {
    return this.props.title
  }
  get description(): string | null {
    return this.props.description
  }
  get status(): TaskStatus {
    return this.props.status
  }
  get dueDate(): string | null {
    return this.props.dueDate
  }

  transitionTo(next: TaskStatus): void {
    const allowed = ALLOWED[this.props.status]
    if (!allowed.includes(next)) {
      throw new TaskDomainError('INVALID_STATE_TRANSITION', '無効な状態遷移です')
    }
    this.props = { ...this.props, status: next }
  }

  updateContent(input: { title?: string; description?: string | null; dueDate?: string | null }): void {
    if (this.props.status === 'done') {
      throw new TaskDomainError('INVALID_STATE_TRANSITION', '無効な状態遷移です')
    }
    this.props = {
      ...this.props,
      title: input.title !== undefined ? assertTitle(input.title) : this.props.title,
      description: input.description !== undefined ? input.description : this.props.description,
      dueDate: input.dueDate !== undefined ? input.dueDate : this.props.dueDate,
    }
  }

  toJSON(): TaskProps {
    return { ...this.props }
  }
}
