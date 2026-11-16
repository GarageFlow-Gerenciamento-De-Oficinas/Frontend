
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

const mockEmail = "mock@garageflow.com"
const mockPassword = "mockPassword"

vi.mock("../../contexts/AuthContext/useAuth", () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

vi.mock("react-router", () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: null,
    }),
}));

beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(undefined);
});

describe("LoginPage", () => {
    it("deve renderizar os elementos principais da página", () => {
        render(<LoginPage />);

        expect(screen.getByRole("heading", { name: "GarageFlow" })).toBeInTheDocument();

        expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();

        expect(screen.getByLabelText("E-mail")).toBeInTheDocument();

        expect(screen.getByLabelText("Senha")).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    });
    it("deve permitir preencher e-mail e senha", async() => {
        const user = userEvent.setup();

        render(<LoginPage />);
        
        const emailInput = screen.getByLabelText("E-mail");
        const passwordInput = screen.getByLabelText("Senha");

        await user.type(emailInput, mockEmail);
        await user.type(passwordInput, mockPassword);
        
        expect(emailInput).toHaveValue(mockEmail);
        expect(passwordInput).toHaveValue(mockPassword);
    });
    it("deve realizar login e redirecionar após sucesso", async () => {
        const user = userEvent.setup();

        render(<LoginPage />);

        await user.type(screen.getByLabelText("E-mail"), mockEmail);
        await user.type(screen.getByLabelText("Senha"), mockPassword);
        await user.click(screen.getByRole("button", {name: "Entrar"}));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: mockEmail,
                password: mockPassword
            });

            expect(mockNavigate).toHaveBeenCalledWith("/", {
                replace: true
            })
        })
    });
    it("deve exibir mensagem de erro quando o login falhar", async () => {
        const user = userEvent.setup();
        mockLogin.mockRejectedValueOnce(
            new Error("Credenciais inválidas.")
        )

        render(<LoginPage />);

        await user.type(screen.getByLabelText("E-mail"), mockEmail);
        await user.type(screen.getByLabelText("Senha"), "senha-incorreta");
        await user.click(screen.getByRole("button", {name: "Entrar"}));

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Credenciais inválidas.");

        expect(mockLogin).toHaveBeenCalledWith({
            email: mockEmail,
            password: "senha-incorreta",
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
    it("deve desabilitar o botão enquanto o login está sendo processado", async () => {
        const user = userEvent.setup();

        let resolveLogin!: () => void;

        mockLogin.mockImplementation(
            () => 
                new Promise<void>((resolve) => {
                    resolveLogin = resolve;
                })
        );

        render(<LoginPage />);

        await user.type(screen.getByLabelText("E-mail"), mockEmail);
        await user.type(screen.getByLabelText("Senha"), mockPassword);
        const submitButton = screen.getByRole("button", {
            name: "Entrar",
        });
        await user.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Entrando...");

        resolveLogin();

        await waitFor(() => {
            expect(submitButton).toBeEnabled();
        });

        expect(mockNavigate).toHaveBeenCalledWith("/", {
            replace: true
        })
    })
});