import { and, eq } from 'drizzle-orm';
import { users } from '../db/schema.js';
import type {
  CreateUserData,
  DbClient,
  UpdateUserData,
  UserRecord,
} from './types.js';

function mapUser(row: typeof users.$inferSelect): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class UserRepository {
  constructor(private readonly db: DbClient) {}

  async withTransaction<T>(
    fn: (repo: UserRepository) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (tx) => fn(new UserRepository(tx)));
  }

  async findById(id: string): Promise<UserRecord | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ? mapUser(row) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email.trim().toLowerCase()), eq(users.isActive, true)))
      .limit(1);
    return row ? mapUser(row) : null;
  }

  async create(data: CreateUserData): Promise<UserRecord> {
    const [row] = await this.db
      .insert(users)
      .values({
        id: data.id,
        email: data.email.trim().toLowerCase(),
        passwordHash: data.passwordHash,
        name: data.name ?? null,
        isActive: true,
      })
      .returning();
    if (!row) {
      throw new Error('ユーザーの作成に失敗しました');
    }
    return mapUser(row);
  }

  async update(id: string, data: UpdateUserData): Promise<UserRecord> {
    const [row] = await this.db
      .update(users)
      .set({
        ...(data.email !== undefined
          ? { email: data.email.trim().toLowerCase() }
          : {}),
        ...(data.passwordHash !== undefined
          ? { passwordHash: data.passwordHash }
          : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    if (!row) {
      throw new Error('ユーザーが見つかりません');
    }
    return mapUser(row);
  }

  async delete(id: string): Promise<void> {
    await this.update(id, { isActive: false });
  }
}