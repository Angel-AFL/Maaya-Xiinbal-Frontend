import { apiClient, setToken, removeToken, hasToken } from "./api";
import type { User } from "./api";

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export function isAuthenticated(): boolean {
  return hasToken();
}

export async function register(
  nombre: string,
  apellido: string,
  correo: string,
  contrasena: string,
): Promise<AuthResult> {
  try {
    const data = await apiClient<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nombre, apellido, correo, contrasena }),
    });

    if (data.token) {
      setToken(data.token);
    }

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function login(
  correo: string,
  contrasena: string,
): Promise<AuthResult> {
  try {
    const data = await apiClient<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, contrasena }),
    });

    if (data.token) {
      setToken(data.token);
    }

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getMe(): Promise<AuthResult> {
  try {
    const data = await apiClient<User>("/auth/me");
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function logout(): void {
  removeToken();
  window.location.href = "/";
}
