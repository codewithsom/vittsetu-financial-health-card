import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "officer" | "msme";
export interface User {
  email: string;
  name: string;
  role: Role;
  msmeId?: string;
}

const SEED_USERS: (User & { password: string })[] = [
  { email: "officer@bank.com", password: "demo123", name: "Anita Sharma", role: "officer" },
  { email: "meera@handloom.in", password: "demo123", name: "Meera Devi", role: "msme", msmeId: "msme-001" },
  { email: "rakesh@annapurna.in", password: "demo123", name: "Rakesh Patel", role: "msme", msmeId: "msme-002" },
  { email: "sunita@kirana.in", password: "demo123", name: "Sunita Sharma", role: "msme", msmeId: "msme-003" },
];

export interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

interface AppState {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string; user?: User };
  signup: (email: string, password: string, name: string, role: Role) => { ok: boolean; error?: string };
  logout: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  notifications: Notification[];
  markAllRead: () => void;
}

const Ctx = createContext<AppState | null>(null);

const STORAGE_KEY = "vittsetu.user";
const USERS_KEY = "vittsetu.users";

function loadUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_USERS;
}
function saveUsers(u: (User & { password: string })[]) {
  try { window.localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", text: "New GST filing detected for Sharma Textiles", time: "2m ago", read: false },
    { id: "n2", text: "Score updated for Rajesh Auto Parts (+4 pts)", time: "18m ago", read: false },
    { id: "n3", text: "3 applications pending review", time: "1h ago", read: false },
    { id: "n4", text: "AA consent renewed — Meera Handloom", time: "3h ago", read: true },
  ]);

  // hydrate user from localStorage (persistent session)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    try {
      if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value: AppState = useMemo(() => ({
    user,
    login: (email, password) => {
      const users = loadUsers();
      const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!match) return { ok: false, error: "Invalid email or password" };
      const u: User = { email: match.email, name: match.name, role: match.role, msmeId: match.msmeId };
      persist(u);
      return { ok: true, user: u };
    },
    signup: (email, password, name, role) => {
      const users = loadUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: "An account with that email already exists" };
      }
      const next = [...users, { email, password, name, role }];
      saveUsers(next);
      const u: User = { email, name, role };
      persist(u);
      return { ok: true };
    },
    logout: () => persist(null),
    theme,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    notifications,
    markAllRead: () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true }))),
  }), [user, theme, notifications]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}

export const DEMO_ACCOUNTS = SEED_USERS.map(({ password, ...rest }) => ({ ...rest, password }));