export class InvalidCredentialsError extends Error {
  readonly code = 'INVALID_CREDENTIALS' as const;

  constructor(message = 'メールアドレスまたはパスワードが正しくありません') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}