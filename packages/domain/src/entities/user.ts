const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

export interface CreateUserParams {
  email: string;
  password: string;
  name?: string | null;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProps {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function assertValidEmail(email: string): string {
  const trimmed = email.trim();
  if (!EMAIL_PATTERN.test(trimmed)) {
    throw new Error('メールアドレスの形式が正しくありません');
  }
  return trimmed.toLowerCase();
}

function assertValidPassword(password: string): void {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error('パスワードは6文字以上で入力してください');
  }
}

export class User {
  readonly id: string;
  private _email: string;
  private _name: string | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this._email = props.email;
    this._name = props.name;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(params: CreateUserParams): User {
    assertValidPassword(params.password);
    const now = params.createdAt ?? new Date();
    return new User({
      id: params.id ?? crypto.randomUUID(),
      email: assertValidEmail(params.email),
      name: params.name ?? null,
      createdAt: now,
      updatedAt: params.updatedAt ?? now,
    });
  }

  static reconstitute(props: UserProps): User {
    return new User({
      ...props,
      email: assertValidEmail(props.email),
    });
  }

  get email(): string {
    return this._email;
  }

  get name(): string | null {
    return this._name;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toProps(): UserProps {
    return {
      id: this.id,
      email: this._email,
      name: this._name,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  updateName(name: string | null): void {
    this._name = name;
    this._updatedAt = new Date();
  }
}