import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL;

const mockEmail = "mock@garageflow.com"
const mockPassword = "mockPassword"
const mockToken = "fake-access-token"

export const handlers = [
    http.get(`${API_URL}/auth/csrf/`, () => {
        return new HttpResponse(null, {
            status: 200,
        });
    }),

    http.post(`${API_URL}/auth/login/`, async ({ request }) => {
        const credentials = await request.json() as {
            email: string;
            password: string;
        };

        if (
            credentials.email === mockEmail && credentials.password === mockPassword
        ) {
            return HttpResponse.json({
                access: mockToken
            });
        }

        return HttpResponse.json(
            { detail: "Credenciais inválidas." },
            { status: 401 }
        );
    }),

    http.post(`${API_URL}/auth/token/refresh/`, () => {
        return HttpResponse.json({
            access: "new-fake-access-token",
        });
    }),

    http.post(`${API_URL}/auth/logout/`, () => {
        return HttpResponse.json({
            detail: "Logout realizado com sucesso.",
        })
    }),

    http.get(`${API_URL}/clients/`, () => {
        return HttpResponse.json([]);
    })
]