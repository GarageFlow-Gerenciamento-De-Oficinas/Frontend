
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import PublicRoute from "./PublicRoute";
import { useAuth } from "../../contexts/AuthContext/useAuth";
import { Routes, Route } from "react-router";

function HomePage() {
    return <div>Página inicial</div>;
}

vi.mock("../../contexts/AuthContext/useAuth", () => ({
    useAuth: vi.fn(),
}));

describe("PublicRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve exibir uma mensagem enquanto verifica a sessão", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            login: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <PublicRoute>
                    <div>Página pública</div>
                </PublicRoute>
            </MemoryRouter>
        );

        expect(screen.getByText("Verificando sessão...")).toBeInTheDocument();
        expect(screen.queryByText("Página pública")).not.toBeInTheDocument();
    });

    it("deve permitir acesso à rota pública quando o usuário não está autenticado", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <PublicRoute>
                    <div>Página pública</div>
                </PublicRoute>
            </MemoryRouter>
        );

        expect(screen.getByText("Página pública")).toBeInTheDocument();
        expect(screen.queryByText("Verificando sessão...")).not.toBeInTheDocument();
    });

    it("deve redirecionar o usuário autenticado para a página inicial", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <div>Página de login</div>
                            </PublicRoute>
                        }
                    />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Página inicial")).toBeInTheDocument();
        expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
    });


    it("deve retornar o usuário autenticado para a rota de origem", () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <MemoryRouter
                initialEntries={[
                    {
                        pathname: "/login",
                        state: {
                            from: {
                                pathname: "/users",
                                search: "?page=2",
                                hash: "#list",
                            },
                        },
                    },
                ]}
            >
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <div>Página de login</div>
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={<div>Lista de usuários</div>}
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Lista de usuários")).toBeInTheDocument();
        expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
    });

});
