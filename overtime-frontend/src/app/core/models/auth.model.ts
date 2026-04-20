export interface LoginRequest {
  department: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  department: string;
  admin: boolean;
}

export interface AuthState {
  token: string;
  department: string;
  admin: boolean;
}
