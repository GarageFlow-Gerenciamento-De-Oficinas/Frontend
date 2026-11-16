import type { LoginCredentials, TokenResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;
const ACCESS_TOKEN_KEY = "garageflow_access_token";

export async function login(
    credentials: LoginCredentials
): Promise<TokenResponse> {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(credentials)
    })

    if(!response.ok) {
        if (response.status === 401) {
            throw new Error('E-mail ou senha inválidos.')
        }
        throw new Error('Não foi possivel realizar o login. Tente novamente.')
    }

    return response.json() as Promise<TokenResponse>
}

export function saveAccessToken(token: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAuth(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function getCsrfToken(): Promise<string> {
    const response = await fetch(`${API_URL}/auth/csrf/`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Não foi possível obter o token CSRF.");
    }

    const csrfToken = document.cookie
        .split("; ")
        .find(cookie => cookie.startsWith("csrftoken="))
        ?.split('=')[1];

    if(!csrfToken) {
        throw new Error("Cookie CSRF não encontrado.");
    }

    return decodeURIComponent(csrfToken);
}

export async function refreshAccessToken(): Promise<string> {
    const csrfToken = await getCsrfToken();

    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
        },
    });

    if (!response.ok) {
        clearAuth();
        throw new Error("Sua sessão expirou. Entre novamente.");
    }

    const data = await response.json() as TokenResponse;

    saveAccessToken(data.access);

    return data.access;
}

export async function logout(): Promise<void> {
    const csrfToken = await getCsrfToken();

    const response = await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken
        },
    });

    if(!response.ok) {
        throw new Error("Não foi possível encerrar a sessão no servidor.");
    }
}