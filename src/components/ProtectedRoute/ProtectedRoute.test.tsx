import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext/useAuth";
import { MemoryRouter } from "react-router";

vi.mock("../../contexts/AuthContext/useAuth", () => ({
    useAuth: vi.fn(),
}));

describe("ProtectedRoute", () => {
    it("deve exibir uma mensagem enquanto verifica a sessão", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            login: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Conteúdo protegido</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText("Verificando sessão...")).toBeInTheDocument();
        expect(screen.queryByText("Conteúdo protegido")).not.toBeInTheDocument();
    });
});