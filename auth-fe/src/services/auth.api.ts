import { api } from "./api.service";
import type { 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from "@/schemas/auth.schema";
import type { SingleResponse } from "@/types";
import type { User } from "@/types/user.type";

// Base API instance for auth endpoints (no auth token required)
const apiAuth = api;

export const authApi = {
  // Register new user
  async register(
    credentials: RegisterRequest
  ): Promise<SingleResponse<User>> {
    const response = await apiAuth.post('/register', credentials);
    return response.data;
  },

  // Login user
  async login(
    credentials: LoginRequest
  ): Promise<SingleResponse<User>> {
    const response = await apiAuth.post('/login', credentials);
    return response.data;
  },

  // Logout user
  async logout(): Promise<SingleResponse<{ status: string; message: string }>> {
    const response = await apiAuth.delete('/sessions');
    return response.data;
  },

  // Forgot password - send reset email
  async forgotPassword(
    credentials: ForgotPasswordRequest
  ): Promise<SingleResponse<null>> {
    const response = await apiAuth.post('/forgot', credentials);
    return response.data;
  },

  // Reset password with token
  async resetPassword(
    credentials: ResetPasswordRequest
  ): Promise<SingleResponse<{ status: string; message: string }>> {
    const response = await apiAuth.post('/reset', credentials);
    return response.data;
  },

  // Confirm email with token
  async confirmEmail(
    token: string
  ): Promise<SingleResponse<{ status: string; message: string }>> {
    const response = await apiAuth.get(`/confirmation?confirmation_token=${token}`);
    return response.data;
  },

  // Resend confirmation email
  async resendConfirmation(
    email: string
  ): Promise<SingleResponse<null>> {
    const response = await apiAuth.post('/confirmation', { email });
    return response.data;
  },

  // Refresh access token
  async refreshToken(
    refreshToken: string
  ): Promise<SingleResponse<{ access_token: string; refresh_token: string }>> {
    const response = await apiAuth.post('/refresh_token', { 
      refresh_token: refreshToken 
    });
    return response.data;
  },

  // Get current user profile
  async getCurrentUser(): Promise<SingleResponse<User>> {
    const response = await api.get('/user/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(
    profileData: Partial<any>
  ): Promise<SingleResponse<{ status: string; message: string }>> {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  // Change password
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<SingleResponse<{ status: string; message: string }>> {
    const response = await api.put('/users/password', data);
    return response.data;
  },

  // Verify email with token (from email link)
  async verifyEmail(
    email: string,
    token: string
  ): Promise<SingleResponse<null>> {
    const response = await apiAuth.post(
      `/confirmations/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
    );
    return response.data;
  },

  // Check if user is authenticated (utility function)
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Get stored access token (utility function)
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  // Get stored refresh token (utility function)
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  // Store tokens (utility function)
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },

  // Clear tokens (utility function)
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};