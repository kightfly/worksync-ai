export class InvalidStateTransitionError extends Error {
  readonly code = 'INVALID_STATE_TRANSITION' as const;

  constructor(message = '無効な状態遷移です') {
    super(message);
    this.name = 'InvalidStateTransitionError';
  }
}
