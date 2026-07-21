export class UnauthorizedError extends Error {
  readonly code = 'UNAUTHORIZED' as const;

  constructor(message = '認証が必要です') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}