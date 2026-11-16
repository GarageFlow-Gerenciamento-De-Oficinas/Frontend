import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearAuth, getAccessToken, getCsrfToken, login, logout, refreshAccessToken, saveAccessToken } from "../authService";
import { server } from "../../test/server";
import { http, HttpResponse } from "msw";

const token = "fake-access-token"
const token_key = "garageflow_access_token"

const mockEmail = "mock@garageflow.com"
const mockPassword = "mockPassword"

afterEach(() => {
    vi.restoreAllMocks();
});

describe("authService", () => {
    beforeEach(() => {
        sessionStorage.clear();
    })

    it("deve salvar o access token no sessionStorage", () => {
        saveAccessToken(token);

        expect(sessionStorage.getItem(token_key)).toBe(token);
    });

    it("deve recuperar o access token armazenado", () => {
        sessionStorage.setItem(
            token_key,
            token
        );

        expect(getAccessToken()).toBe(token);
    })

    it("deve retornar null quando não existir access token", () => {
        expect(getAccessToken()).toBeNull();
    });

    it("deve remover o access token do sessionStorage", () => {
        sessionStorage.setItem(token_key, token);

        clearAuth();

        expect(
            sessionStorage.getItem(token_key)
        ).toBeNull();
    })
})

describe("getCsrfToken", () => {
    beforeEach(() => {
        document.cookie = "csrftoken=; Max-Age=0; path=/";
        document.cookie = "csrftoken=test-csrf-token; path=/"
    });

    it("deve retornar o token CSRF quando encontrado", async () => {
        const token = await getCsrfToken();

        expect(token).toBe("test-csrf-token");
    });

    it("deve lançar erro quando a requisição falhar", async () => {
        server.use(
            http.get(
                `${import.meta.env.VITE_API_URL}/auth/csrf/`,
                () => {
                    return new HttpResponse(null, {
                        status: 500,
                    });
                }
            )
        );

        await expect(getCsrfToken()).rejects.toThrow(
            "Não foi possível obter o token CSRF."
        )
    });

    it("deve lançar erro quando o cookie CSRF não existir",  async () => {
        document.cookie = "csrftoken=; Max-Age=0; path=/";

        await expect(getCsrfToken()).rejects.toThrow(
            "Cookie CSRF não encontrado."
        );
    });
})

describe("login", () => {
    beforeEach(() => {
        document.cookie = "csrftoken=test-csrf-token; path=/";
    });

    it("deve retornar o access token quando o login for realizado com sucesso", async () => {
        const credentials = {
            email: mockEmail,
            password: mockPassword,
        }

        const response = await login(credentials);

        expect(response).toEqual({
            access: "fake-access-token",
        })
    });

    it("deve lançar erro quando as credenciais forem inválidas", async () => {
        const credentials = {
            email: mockEmail,
            password: "wrong-password",
        };

        await expect(login(credentials)).rejects.toThrow(
            "E-mail ou senha inválidos."
        );
    });

    it("deve lançar erro quando o servidor apresentar uma falha", async () => {
        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/auth/login/`,
                () => {
                    return new HttpResponse(null, { status: 500 });
                }
            )
        );

        await expect(
            login({ email: mockEmail, password: mockPassword })
        ).rejects.toThrow(
            "Não foi possivel realizar o login. Tente novamente."
        )
    });

    it("não deve realizar o login quando não conseguir obter o CSRF", async () => {
        document.cookie = "csrftoken=; Max-Age=0; path=/";

        await expect(
            login({email: mockEmail, password: mockPassword})
        ).rejects.toThrow("Cookie CSRF não encontrado.");
    });

    it("deve enviar as credenciais e os headers corretamente", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        const credentials = {
            email: mockEmail,
            password: mockPassword,
        };

        await login(credentials);

        const loginCall = fetchSpy.mock.calls.find(([url]) =>
            String(url).endsWith("/auth/login/")
        );

        expect(loginCall).toBeDefined();

        const [, options] = loginCall!;

        expect(options?.method).toBe("POST");
        expect(options?.credentials).toBe("include");

        expect(options?.headers).toEqual({
            "Content-Type": "application/json",
            "X-CSRFToken": "test-csrf-token",
        });

        expect(JSON.parse(options?.body as string)).toEqual(credentials);
    })
})

describe("refreshAccessToken", () => {
    beforeEach(() => {
        document.cookie = "csrftoken=; Max-Age=0; path=/";
        document.cookie = "csrftoken=test-csrf-token; path=/";
        sessionStorage.clear();
    });

    it("deve renovar e salvar o novo access token", async () => {
        saveAccessToken(token);

        const newToken = await refreshAccessToken();

        expect(newToken).toBe("new-fake-access-token");
        expect(getAccessToken()).toBe("new-fake-access-token");
    });

    it("deve limpar a autenticação quando o refresh falhar", async () => {
        saveAccessToken(token);

        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
                () => {
                    return new HttpResponse(null, { status:401 });
                }
            )
        );

        await expect(refreshAccessToken()).rejects.toThrow(
            "Sua sessão expirou. Entre novamente."
        );

        expect(getAccessToken()).toBeNull();
    });

    it("Não deve renovar o token quando não conseguir obter o CSRF", async () => {
        document.cookie = "csrftoken=; Max-Age=0; path=/";

        saveAccessToken(token);

        await expect(refreshAccessToken()).rejects.toThrow(
            "Cookie CSRF não encontrado."
        );

        expect(getAccessToken()).toBe(token);
    });

    it("deve enviar as credenciais e o header CSRF corretamente no refresh", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        await refreshAccessToken();

        const refreshCall = fetchSpy.mock.calls.find(([url]) =>
            String(url).endsWith("/auth/token/refresh/")
        );

        expect(refreshCall).toBeDefined();

        const [url, options] = refreshCall!;


        expect(url.toString()).toBe(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`);
        expect(options?.method).toBe("POST");
        expect(options?.credentials).toBe("include");

        expect(options?.headers).toEqual({
            "X-CSRFToken": "test-csrf-token",
        });
    })
});

describe("logout", () => {
    beforeEach(() => {
        document.cookie = "csrftoken=; Max-Age=0; path=/";
        document.cookie = "csrftoken=test-csrf-token; path=/";
    });


    it("deve realizar o logout com sucesso", async () => {
        await expect(logout()).resolves.toBeUndefined();
    });

    it("deve lançar erro quando o servidor apresentar uma falha", async () => {
        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/auth/logout/`,
                () => {
                    return new HttpResponse(null, { status: 500 });
                }
            )
        );

        await expect(
            logout()
        ).rejects.toThrow(
            "Não foi possível encerrar a sessão no servidor."
        )
    });

    it("deve lançar erro ao tentar obter o CSRF token e não conseguir", async () => {
        document.cookie = "csrftoken=; Max-Age=0; path=/";

        await expect(logout()).rejects.toThrow(
            "Cookie CSRF não encontrado."
        );
    });

    it("deve enviar as credenciais e os headers corretamente", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        await logout();

        const logoutCall = fetchSpy.mock.calls.find(([url]) =>
            String(url).endsWith("/auth/logout/")
        );

        expect(logoutCall).toBeDefined();

        const [url, options] = logoutCall!;

        expect(url.toString()).toBe(`${import.meta.env.VITE_API_URL}/auth/logout/`);
        expect(options?.method).toBe("POST");
        expect(options?.credentials).toBe("include");

        expect(options?.headers).toEqual({
            "X-CSRFToken": "test-csrf-token",
        });
    })
})