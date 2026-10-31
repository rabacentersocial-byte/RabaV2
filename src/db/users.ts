import { db, withDbRetry } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const result = await withDbRetry(() =>
      db.insert(users)
        .values({
          uid,
          email,
          displayName: displayName || '',
          photoUrl: photoUrl || '',
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            ...(displayName ? { displayName } : {}),
            ...(photoUrl ? { photoUrl } : {}),
          },
        })
        .returning()
    );

    return result[0];
  } catch (error) {
    console.error('Database user getOrCreate failed:', error);
    throw new Error('Database user operation failed', { cause: error });
  }
}

export async function getUsers() {
  try {
    return await withDbRetry(() => db.select().from(users));
  } catch (error) {
    console.error('Database query failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
