// Type definitions for API requests and responses

export interface User {
  id: string;
  name: string;
  email: string;
  role: "household" | "municipality";
  isEmailVerified: boolean;
}

// Registration types
export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  role: "household" | "municipality";
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Login types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// Generic API response for other endpoints
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Error response
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}
