export type StoredUser = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  birthDate: string;
};

const KEY = "auth:user";

export function saveUser(u: StoredUser) {
  try {
    localStorage.setItem(KEY, JSON.stringify(u));
  } catch {}
}

export function loadUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
