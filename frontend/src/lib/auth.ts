// Local auth store using localStorage for username/password auth
// This simulates a username/password system on top of ICP identity

export interface LocalUser {
  name: string;
  secretUsername: string;
  passwordHash: string;
  principalId?: string;
}

const USERS_KEY = 'streamora_users';
const CURRENT_USER_KEY = 'streamora_current_user';

// Admin credentials
export const ADMIN_USERNAME = 'SHUBOWNER2026';
export const ADMIN_PASSWORD = 'Shubhro@007';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function getUsers(): LocalUser[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(name: string, secretUsername: string, password: string): { success: boolean; error?: string } {
  if (secretUsername === ADMIN_USERNAME) {
    return { success: false, error: 'Username not available' };
  }
  const users = getUsers();
  const exists = users.find(u => u.secretUsername.toLowerCase() === secretUsername.toLowerCase());
  if (exists) {
    return { success: false, error: 'Username already taken' };
  }
  const newUser: LocalUser = {
    name,
    secretUsername,
    passwordHash: simpleHash(password),
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true };
}

export function loginUser(secretUsername: string, password: string): { success: boolean; user?: LocalUser; isAdmin?: boolean; error?: string } {
  // Check admin
  if (secretUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const adminUser: LocalUser = {
      name: 'Admin',
      secretUsername: ADMIN_USERNAME,
      passwordHash: simpleHash(ADMIN_PASSWORD),
    };
    return { success: true, user: adminUser, isAdmin: true };
  }

  const users = getUsers();
  const user = users.find(u => u.secretUsername.toLowerCase() === secretUsername.toLowerCase());
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }
  if (user.passwordHash !== simpleHash(password)) {
    return { success: false, error: 'Invalid username or password' };
  }
  return { success: true, user };
}

export interface CurrentSession {
  secretUsername: string;
  name: string;
  isAdmin: boolean;
}

export function getCurrentSession(): CurrentSession | null {
  try {
    const data = sessionStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentSession(session: CurrentSession): void {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
}

export function clearCurrentSession(): void {
  sessionStorage.removeItem(CURRENT_USER_KEY);
}
