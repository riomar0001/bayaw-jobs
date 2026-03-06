import { apiClient } from '../client';
import {
  ApiResponse,
  ForgotPasswordInput,
  LoginHistoryItem,
  LoginInput,
  LoginStep1Response,
  LoginStep2Response,
  PaginatedResponse,
  RefreshResponse,
  RegisterInput,
  ResetPasswordInput,
  UpdatePasswordInput,
  User,
  unwrapResponse,
} from '../types';

class AuthService {
  async register(data: RegisterInput): Promise<User> {
    const res = await apiClient.post<ApiResponse<{ user: User }>>('/auth/register', data);
    return unwrapResponse(res.data).user;
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.get<ApiResponse<null>>('/auth/verify-email', { params: { token } });
  }

  /** Step 1: submit email + password, receive temp_token */
  async login(data: LoginInput): Promise<LoginStep1Response> {
    const res = await apiClient.post<ApiResponse<LoginStep1Response>>('/auth/login', data);
    return unwrapResponse(res.data);
  }

  /**
   * Step 2: submit OTP code.
   * Pass the temp_token received from login() — it's used as the Bearer token for this call.
   * On success, store the returned access_token via apiClient.setToken().
   */
  async verifyAuth(code: string, tempToken: string): Promise<LoginStep2Response> {
    const res = await apiClient.post<ApiResponse<LoginStep2Response>>(
      '/auth/verify-auth',
      { code },
      { headers: { Authorization: `Bearer ${tempToken}` } }
    );
    const data = unwrapResponse(res.data);
    apiClient.setToken(data.access_token);
    return data;
  }

  async refresh(): Promise<RefreshResponse> {
    const res = await apiClient.post<ApiResponse<RefreshResponse>>('/auth/refresh');
    const data = unwrapResponse(res.data);
    apiClient.setToken(data.accessToken);
    return data;
  }

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<null>>('/auth/logout');
    apiClient.setToken(null);
  }

  async logoutAll(): Promise<void> {
    await apiClient.post<ApiResponse<null>>('/auth/logout-all');
    apiClient.setToken(null);
  }

  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    await apiClient.post<ApiResponse<null>>('/auth/forgot-password', data);
  }

  async resetPassword(token: string, data: ResetPasswordInput): Promise<void> {
    await apiClient.post<ApiResponse<null>>(`/auth/reset-password/${token}`, data);
  }

  async updatePassword(data: UpdatePasswordInput): Promise<void> {
    await apiClient.patch<ApiResponse<null>>('/auth/password', data);
  }

  async getLoginHistory(): Promise<PaginatedResponse<LoginHistoryItem>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<LoginHistoryItem>>>(
      '/auth/login-history'
    );
    return unwrapResponse(res.data);
  }
}

export const authService = new AuthService();
