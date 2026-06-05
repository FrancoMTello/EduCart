import type {
  AuthSession,
  AuthUser,
  StoredUser,
} from "@/features/auth/types/AuthUser";

const USERS_STORAGE_KEY = "educart.users";
const SESSION_STORAGE_KEY = "educart.auth.session";

type RegisterPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const readUsers = (): StoredUser[] => {
  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers) as StoredUser[];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const createToken = (user: AuthUser) => {
  const payload = {
    email: user.email,
    exp: Date.now() + 1000 * 60 * 60 * 4,
    role: user.role,
    sub: user.id,
  };

  return `mock-jwt.${btoa(JSON.stringify(payload))}.educart`;
};

const createSession = (user: AuthUser): AuthSession => ({
  token: createToken(user),
  user,
});

export const authService = {
  getSession(): AuthSession | null {
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) {
      return null;
    }

    try {
      return JSON.parse(storedSession) as AuthSession;
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  },

  login(payload: LoginPayload): AuthSession {
    const users = readUsers();
    const user = users.find(
      (storedUser) =>
        storedUser.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (!user || user.password !== payload.password) {
      throw new Error("Email o contraseña incorrectos.");
    }

    const { password: _password, ...publicUser } = user;
    const session = createSession(publicUser);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    return session;
  },

  logout() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  register(payload: RegisterPayload): AuthSession {
    const users = readUsers();
    const normalizedEmail = payload.email.trim().toLowerCase();
    const userExists = users.some(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );

    if (userExists) {
      throw new Error("Ya existe una cuenta con ese email.");
    }

    const user: StoredUser = {
      email: normalizedEmail,
      firstName: payload.firstName.trim(),
      id: crypto.randomUUID(),
      lastName: payload.lastName.trim(),
      password: payload.password,
      role: normalizedEmail.includes("admin") ? "ADMIN" : "CLIENT",
    };

    writeUsers([...users, user]);

    const { password: _password, ...publicUser } = user;
    const session = createSession(publicUser);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    return session;
  },
};
