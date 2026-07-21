export class NotFoundError extends Error {
  readonly code = 'NOT_FOUND' as const;

  constructor(message = 'リソースが見つかりません') {
    super(message);
    this.name = 'NotFoundError';
  }
}