import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveAccessToken } from "../authService";
import { apiFetch } from "../apiService";
import { server } from "../../test/server";
import { http, HttpResponse } from "msw";

const token = "fake-access-token";

describe("apiFetch", () => {
    beforeEach(() => {
        sessionStorage.clear();
        saveAccessToken(token);
    });

    it("deve enviar o access token no header Authorization", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        await apiFetch('/clients/');

        const requestCall = fetchSpy.mock.calls.find(([url]) => 
            String(url).endsWith('/clients/')
        );

        expect(requestCall).toBeDefined()

        const [, options] = requestCall!;

        const headers = new Headers(options?.headers);

        expect(headers.get("Authorization")).toBe(
            `Bearer ${token}`
        )
    });

    it("deve realizar uma requisição sem enviar o access token", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");
        sessionStorage.clear();
        await apiFetch('/clients/', {
            authenticated: false,
        });

        const requestCall = fetchSpy.mock.calls.find(([url]) => 
            String(url).endsWith('/clients/')
        );

        expect(requestCall).toBeDefined()

        const [, options] = requestCall!;

        const headers = new Headers(options?.headers);

        expect(headers.get("Authorization")).toBeNull();
    });

    it("deve lançar erro quando não existir access token", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        sessionStorage.clear();

        await expect(
            apiFetch("/clients/")
        ).rejects.toThrow(
            "Sua sessão expirou. Entre novamente."
        );

        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("deve validar o content type", async () => {
        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/clients/`,
                () => {
                    return new HttpResponse(null, {
                        status: 201,
                    });
                }
            )
        );

        const fetchSpy = vi.spyOn(globalThis, "fetch");
        await apiFetch('/clients/', {
            method: "POST",
            body: JSON.stringify({name:"Cliente Teste"}),
        });

        const requestCall = fetchSpy.mock.calls.find(([url]) => 
            String(url).endsWith('/clients/')
        );

        expect(requestCall).toBeDefined()

        const [, options] = requestCall!;

        const headers = new Headers(options?.headers);

        expect(headers.get("Content-Type")).toBe("application/json");
        expect(options?.method).toBe("POST");
        expect(JSON.parse(options?.body as string)).toEqual({
            name: "Cliente Teste",
        });
    });

    it("deve renovar o access token quando receber 401", async () => {
        document.cookie = "csrftoken=test-csrf-token; path=/";

        const fetchSpy = vi.spyOn(globalThis, "fetch");
        let requestCount = 0;
        server.use(
            http.get(`${import.meta.env.VITE_API_URL}/clients/`, () => {
                requestCount++;

                if (requestCount === 1) {
                    return new HttpResponse(null, { status: 401 });
                }

                return HttpResponse.json([])
            })
        );
        const response = await apiFetch("/clients/");
        const clientRequests = fetchSpy.mock.calls.filter(([url]) =>
            String(url).endsWith("/clients/")
        );

        expect(clientRequests).toHaveLength(2);

        const firstHeaders = new Headers(clientRequests[0][1]?.headers);
        const secondHeaders = new Headers(clientRequests[1][1]?.headers);

        expect(firstHeaders.get("Authorization")).toBe(
            "Bearer fake-access-token"
        );

        expect(secondHeaders.get("Authorization")).toBe(
            "Bearer new-fake-access-token"
        );
        expect(response.status).toBe(200);
        expect(requestCount).toBe(2);
    });    

    it("deve limpar a autenticação quando falhar ao renovar o access token", async () => {
        document.cookie = "csrftoken=test-csrf-token; path=/";

        server.use(
            http.get(`${import.meta.env.VITE_API_URL}/clients/`, () => {
                return new HttpResponse(null, { status: 401 });
            }),

            http.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, () => {
                return HttpResponse.json(
                    { detail: "Token inválido." },
                    { status: 401 }
                );
            })
        );

        await expect(
            apiFetch("/clients/")
        ).rejects.toThrow("Sua sessão expirou. Entre novamente.");

        expect(sessionStorage.getItem("garageflow_access_token")).toBeNull();
    });

    it("deve limpar a autenticação quando a requisição continuar retornando 401 após a renovação", async () => {
        document.cookie = "csrftoken=test-csrf-token; path=/";

        let requestCount = 0;

        server.use(
            http.get(`${import.meta.env.VITE_API_URL}/clients/`, () => {
                requestCount++;

                return new HttpResponse(null, { status: 401 });
            })
        );

        const response = await apiFetch("/clients/");

        expect(response.status).toBe(401);
        expect(requestCount).toBe(2);
        expect(sessionStorage.getItem("garageflow_access_token")).toBeNull();
    });

    it("deve reutilizar o access token atualizado sem realizar outro refresh", async () => {
        let requestCount = 0;
        let refreshCount = 0;

        server.use(
            http.get(`${import.meta.env.VITE_API_URL}/clients/`, () => {
                requestCount++;

                if (requestCount === 1) {
                    saveAccessToken("new-fake-access-token");

                    return new HttpResponse(null, { status: 401 });
                }

                return HttpResponse.json([]);
            }),

            http.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, () => {
                refreshCount++;

                return HttpResponse.json({
                    access: "another-fake-access-token",
                });
            })
        );

        const response = await apiFetch("/clients/");

        expect(response.status).toBe(200);
        expect(requestCount).toBe(2);
        expect(refreshCount).toBe(0);
    });

    it("deve compartilhar a renovação do token entre requisições concorrentes", async () => {
        document.cookie = "csrftoken=test-csrf-token; path=/";

        let requestCount = 0;
        let refreshCount = 0;

        server.use(
            http.get(`${import.meta.env.VITE_API_URL}/clients/`, () => {
                requestCount++;

                // As duas primeiras chamadas recebem 401.
                if (requestCount <= 2) {
                    return new HttpResponse(null, { status: 401 });
                }

                return HttpResponse.json([]);
            }),

            http.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, () => {
                refreshCount++;

                return HttpResponse.json({
                    access: "new-fake-access-token",
                });
            })
        );

        const [response1, response2] = await Promise.all([
            apiFetch("/clients/"),
            apiFetch("/clients/"),
        ]);

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);

        expect(requestCount).toBe(4);
        expect(refreshCount).toBe(1);
    });

    it("não deve renovar o token quando uma requisição pública retornar 401", async () => {
        let refreshCount = 0;

        server.use(
            http.get(`${import.meta.env.VITE_API_URL}/clients/`, () => {
                return new HttpResponse(null, { status: 401 });
            }),

            http.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, () => {
                refreshCount++;

                return HttpResponse.json({
                    access: "new-fake-access-token",
                });
            })
        );

        const response = await apiFetch("/clients/", {
            authenticated: false,
        });

        expect(response.status).toBe(401);
        expect(refreshCount).toBe(0);
    });
});