import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  role: "student" | "admin";
  sscGpa?: string;
  hscGpa?: string;
  subject?: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: "student" | "admin";
  sscGpa?: string;
  hscGpa?: string;
  subject?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; message: string; role?: string };
  register: (data: RegisterData) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "bd_admission_users";
const SESSION_KEY = "bd_admission_session";

const DEMO_USER = {
  email: "demo@admissionbondu.com",
  password: "demo123",
  name: "Rahel Islam",
  phone: "+880 1711-123456",
  studentId: "BD-20241234",
  role: "student" as const,
  sscGpa: "5.00",
  hscGpa: "4.83",
  subject: "CSE",
};

const ADMIN_USER = {
  email: "admin@admissionbondu.com",
  password: "admin123",
  name: "System Admin",
  phone: "+880 1999-999999",
  studentId: "ADMIN-001",
  role: "admin" as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const getUsers = (): any[] => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [DEMO_USER, ADMIN_USER];
    } catch {
      return [DEMO_USER, ADMIN_USER];
    }
  };

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (found) {
      const userData: User = {
        name: found.name,
        email: found.email,
        phone: found.phone,
        studentId: found.studentId || `BD-${Date.now().toString().slice(-8)}`,
        role: found.role || "student",
        sscGpa: found.sscGpa,
        hscGpa: found.hscGpa,
        subject: found.subject,
      };
      setUser(userData);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      return { success: true, message: "Login successful", role: userData.role };
    }
    return { success: false, message: "Invalid email or password. Please try again." };
  };

  const register = (data: RegisterData) => {
    const users = getUsers();

    if (users.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      ...data,
      role: data.role || "student",
      studentId: `BD-${Date.now().toString().slice(-8)}`,
    };

    const initUsers = localStorage.getItem(USERS_KEY) ? users : [DEMO_USER, ADMIN_USER];
    initUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(initUsers));
    return { success: true, message: "Account created successfully! Please login." };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
