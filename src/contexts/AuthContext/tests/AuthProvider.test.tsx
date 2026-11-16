import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "../AuthProvider";
import { useAuth } from "../useAuth";

import * as authService from "../../../services/authService";

vi.mock("../../../services/authService", () => ({
    login: vi.fn(),
    clearAuth: vi.fn(),
    refreshAccessToken: vi.fn(),
    saveAccessToken: vi.fn(),
    logout: vi.fn(),
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

function AuthConsumer() {
    const { isAuthenticated, isLoading, login, logout } = useAuth();

    return (
        <div>
            <span data-testid="authenticated">
                {String(isAuthenticated)}
            </span>

            <span data-testid="loading">
                {String(isLoading)}
            </span>

            <button onClick={() => {
                void login({
                    email: "test@garageflow.com",
                    password: "password123",
                }).catch(() => {});
            }}>
                Login
            </button>

            <button onClick={() => {
                void logout().catch(() => {})}}>
                Logout
            </button>
        </div>
    );
}

describe("AuthProvider", () => {
    it("deve restaurar a sessão quando o refresh token for válido", async () => {
        vi.mocked(authService.refreshAccessToken).mockResolvedValue(
            "fake-access-token"
        );

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId("loading")).toHaveTextContent("true");

        await waitFor(() => {
            expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        expect(authService.refreshAccessToken).toHaveBeenCalledTimes(1);
    });

    it("deve limpar a autenticação quando falhar ao restaurar a sessão", async () => {
        vi.mocked(authService.refreshAccessToken).mockRejectedValue(
            new Error("Sua sessão expirou. Entre novamente.")
        );

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        expect(authService.refreshAccessToken).toHaveBeenCalledTimes(1);
        expect(authService.clearAuth).toHaveBeenCalledTimes(1);
    });

    it("deve autenticar o usuário após um login bem-sucedido", async () => {
        vi.mocked(authService.refreshAccessToken).mockResolvedValue(
            "fake-access-token"
        );

        vi.mocked(authService.login).mockResolvedValue({
            access: "new-access-token",
            refresh: "new-refresh-token"
        });

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        screen.getByRole("button", { name: "Login" }).click();

        await waitFor(() => {
            expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
        });

        expect(authService.login).toHaveBeenCalledWith({
            email: "test@garageflow.com",
            password: "password123",
        });

        expect(authService.saveAccessToken).toHaveBeenCalledWith(
            "new-access-token"
        );
    });

    it("não deve autenticar o usuário quando o login falhar", async () => {
        vi.mocked(authService.refreshAccessToken).mockRejectedValue(
            new Error("Sua sessão expirou.")
        );

        vi.mocked(authService.login).mockRejectedValue(
            new Error("Credenciais inválidas.")
        );

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        screen.getByRole("button", { name: "Login" }).click();

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
        expect(authService.saveAccessToken).not.toHaveBeenCalled();
    });

    it("deve desautenticar o usuário após o logout", async () => {
        vi.mocked(authService.refreshAccessToken).mockResolvedValue(
            "fake-access-token"
        );

        vi.mocked(authService.logout).mockResolvedValue(undefined);

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        await waitFor(() => {
            expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
        });

        screen.getByRole("button", { name: "Logout" }).click();

        await waitFor(() => {
            expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
        });

        expect(authService.logout).toHaveBeenCalledTimes(1);
        expect(authService.clearAuth).toHaveBeenCalledTimes(1);
    });

    it("deve limpar a autenticação mesmo quando o logout falhar", async () => {
        vi.mocked(authService.refreshAccessToken).mockResolvedValue(
            "fake-access-token"
        );

        vi.mocked(authService.logout).mockRejectedValue(
            new Error("Erro ao realizar logout.")
        );

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
            expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
        });

        screen.getByRole("button", { name: "Logout" }).click();

        await waitFor(() => {
            expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
        });

        expect(authService.logout).toHaveBeenCalledTimes(1);
        expect(authService.clearAuth).toHaveBeenCalledTimes(1);
    });
});