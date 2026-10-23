import { cookies } from 'next/headers';
import { getDb } from '@/lib/mongodb';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Subscriber {
  email: string;
  userId?: string;
  createdAt: string;
}

// Simple fast hash for passwords (server side)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + password.length;
}

// ── User Management ─────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<User[]> {
  try {
    const db = await getDb();
    const users = await db.collection<User>('users').find({}).toArray();
    return users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      passwordHash: u.passwordHash,
      createdAt: u.createdAt,
    }));
  } catch (err) {
    console.error('MongoDB getAllUsers error:', err);
    return [];
  }
}

export async function getUserByEmailOrUsername(identifier: string): Promise<User | null> {
  try {
    const db = await getDb();
    const clean = identifier.trim().toLowerCase();
    const user = await db.collection<User>('users').findOne({
      $or: [
        { email: clean },
        { username: { $regex: new RegExp(`^${clean}$`, 'i') } }
      ]
    });
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  } catch (err) {
    console.error('MongoDB getUserByEmailOrUsername error:', err);
    return null;
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ user?: User; error?: string }> {
  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { error: 'Username must be at least 3 characters.' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 4) {
    return { error: 'Password must be at least 4 characters.' };
  }

  try {
    const db = await getDb();
    const usersCol = db.collection<User>('users');

    const existingEmail = await usersCol.findOne({ email: cleanEmail });
    if (existingEmail) {
      return { error: 'An account with this email already exists.' };
    }

    const existingUser = await usersCol.findOne({
      username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') }
    });
    if (existingUser) {
      return { error: 'This username is already taken.' };
    }

    const newUser: User = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    await usersCol.insertOne(newUser as any);
    return { user: newUser };
  } catch (err) {
    console.error('MongoDB registerUser error:', err);
    return { error: 'Database error registering user.' };
  }
}

export async function verifyUser(identifier: string, password: string): Promise<User | null> {
  const clean = identifier.trim().toLowerCase();
  
  // Built-in Administrator credentials check
  if (clean === 'financialjournaladmin' && password === 'financialjournaladmin') {
    return {
      id: 'admin_fj_special',
      username: 'financialjournaladmin',
      email: 'editorial.financialjournal@gmail.com',
      passwordHash: hashPassword('financialjournaladmin'),
      createdAt: '2026-01-01T00:00:00.000Z',
    };
  }

  const user = await getUserByEmailOrUsername(identifier);
  if (!user) return null;
  if (user.passwordHash === hashPassword(password)) {
    return user;
  }
  return null;
}

// ── Session Management ────────────────────────────────────────────────────────

export async function createSession(user: User): Promise<string> {
  const token = 'sess_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

  const newSession: Session = {
    token,
    userId: user.id,
    username: user.username,
    email: user.email,
    createdAt: new Date().toISOString()
  };

  try {
    const db = await getDb();
    await db.collection<Session>('sessions').insertOne(newSession as any);
  } catch (err) {
    console.error('MongoDB createSession error:', err);
  }

  // Set HTTP-only Cookie
  const cookieStore = await cookies();
  cookieStore.set('bs_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  return token;
}

export async function getCurrentUser(): Promise<{ id: string; username: string; email: string; isSubscribed: boolean } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bs_session')?.value;
    if (!token) return null;

    const db = await getDb();
    const session = await db.collection<Session>('sessions').findOne({ token });
    if (!session) return null;

    const subscribed = await isSubscribed(session.email);

    return {
      id: session.userId,
      username: session.username,
      email: session.email,
      isSubscribed: subscribed
    };
  } catch (err) {
    console.error('MongoDB getCurrentUser error:', err);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bs_session')?.value;
    if (token) {
      const db = await getDb();
      await db.collection<Session>('sessions').deleteOne({ token });
    }
    cookieStore.delete('bs_session');
  } catch (err) {
    console.error('Error destroying session:', err);
  }
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

export async function isSubscribed(email: string): Promise<boolean> {
  try {
    const db = await getDb();
    const cleanEmail = email.trim().toLowerCase();
    const sub = await db.collection<Subscriber>('subscribers').findOne({ email: cleanEmail });
    return !!sub;
  } catch (err) {
    console.error('MongoDB isSubscribed error:', err);
    return false;
  }
}

export async function addSubscription(email: string, userId?: string): Promise<boolean> {
  try {
    const db = await getDb();
    const cleanEmail = email.trim().toLowerCase();
    await db.collection<Subscriber>('subscribers').updateOne(
      { email: cleanEmail },
      {
        $setOnInsert: {
          email: cleanEmail,
          userId,
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error('MongoDB addSubscription error:', err);
    return false;
  }
}

export async function removeSubscription(email: string): Promise<boolean> {
  try {
    const db = await getDb();
    const cleanEmail = email.trim().toLowerCase();
    await db.collection<Subscriber>('subscribers').deleteOne({ email: cleanEmail });
    return true;
  } catch (err) {
    console.error('MongoDB removeSubscription error:', err);
    return false;
  }
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    const db = await getDb();
    const subs = await db.collection<Subscriber>('subscribers').find({}).toArray();
    return subs.map(s => ({
      email: s.email,
      userId: s.userId,
      createdAt: s.createdAt,
    }));
  } catch (err) {
    console.error('MongoDB getAllSubscribers error:', err);
    return [];
  }
}
