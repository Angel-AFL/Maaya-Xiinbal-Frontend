const API_BASE = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("auth_token");
}

export function hasToken(): boolean {
  return !!getToken();
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  token?: string;
  user?: T;
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  lat?: string;
  long?: string;
}

export async function apiClient<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}`);
  }

  return data as ApiResponse<T>;
}
