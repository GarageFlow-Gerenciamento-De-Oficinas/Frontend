import { createContext } from "react";
import type { LoginCredentials } from "../../types/auth";

interface AuthContextData {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);