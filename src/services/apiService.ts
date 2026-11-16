import { getAccessToken, refreshAccessToken, clearAuth } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

interface ApiOptions extends RequestInit {
    authenticated?: boolean;
}

let refreshPromise: Promise<string> | null = null;

async function getNewAccessToken(): Promise<string> {
    if(!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
        })
    }
    return refreshPromise;
}

function getAuthHeaders(headers: Headers, authenticated: boolean, token?: string): Headers {
    if (authenticated) {
        const accessToken = token ?? getAccessToken();

        if (!accessToken) {
            throw new Error("Sua sessão expirou. Entre novamente.");
        }

        headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers
}

export async function apiFetch (
    path: string,
    options: ApiOptions = {},
): Promise<Response> {
    const { authenticated = true, headers, ...requestOptions } = options;
    const requestHeaders = new Headers(headers);

    if (requestOptions.body && !requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
    }

    const executeRequest = (token?: string) => {
        const headers = getAuthHeaders(
            new Headers(requestHeaders),
            authenticated,
            token,
        );

        return fetch(`${API_URL}${path}`, {
            ...requestOptions,
            credentials: "include",
            headers,
        });
    };

    const originalToken = authenticated ? getAccessToken() ?? undefined : undefined;

    const response = await executeRequest(originalToken);

    if (response.status !== 401 || !authenticated) {
        return response;
    }

    const currentToken = getAccessToken();

    let newAccessToken: string;

    if(currentToken && currentToken !== originalToken) {
        newAccessToken = currentToken;
    } else {
        try {
            newAccessToken = await getNewAccessToken();
        } catch {
            clearAuth();
            throw new Error("Sua sessão expirou. Entre novamente.");
        }
    }

    const retryResponse = await executeRequest(newAccessToken);

    if (retryResponse.status === 401) {
        clearAuth();
    }

    return retryResponse;
}