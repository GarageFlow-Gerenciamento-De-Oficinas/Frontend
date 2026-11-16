import { useEffect, useState, type ReactNode } from "react";
import { login as loginRequest, clearAuth, refreshAccessToken, saveAccessToken, logout as logoutRequest } from "../../services/authService";

import type { LoginCredentials } from "../../types/auth";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            try {
                await refreshAccessToken();
                setIsAuthenticated(true);
            } catch {
                clearAuth();
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession();
    }, []);

    async function login(credentials: LoginCredentials): Promise<void> {
        const tokens = await loginRequest(credentials);
        
        saveAccessToken(tokens.access);
        setIsAuthenticated(true);
    }

    async function logout(): Promise<void> {
        try {
            await logoutRequest();
        } finally {
            clearAuth();
            setIsAuthenticated(false);
        }
    }

    return (
        <AuthContext.Provider
            value= {{
                isAuthenticated,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}