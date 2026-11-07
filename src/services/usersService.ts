import type { User } from "../types/user";
import { apiFetch } from "./apiService";

const URL_PATH = "/users"

export async function getUsers(): Promise<User[]> {
    const response = await apiFetch(URL_PATH, {method: 'GET'})
    if (!response.ok) {
        throw new Error("Ocorreu um erro na sua solicitação")
    }
    return response.json() as Promise<User[]>
}