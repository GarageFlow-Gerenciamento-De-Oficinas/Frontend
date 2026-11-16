export interface LoginCredentials {
  email: string
  password: string
}

export interface TokenResponse {
  access: string
  refresh: string
}

export interface LoginLocationState {
    from?: {
        pathname?: string;
        search?: string;
        hash?: string;
    };
}