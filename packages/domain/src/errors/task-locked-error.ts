export class TaskLockedError extends Error {
  readonly code = 'TASK_LOCKED' as const;

  constructor(message = '完了したタスクは変更できません') {
    super(message);
    this.name = 'TaskLockedError';
  }
}
