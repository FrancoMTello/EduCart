export type UserRole = "CLIENT" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type StoredUser = AuthUser & {
  password: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
