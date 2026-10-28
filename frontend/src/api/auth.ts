import { apiClient } from './client';
import type { AuthResponse, User } from '../types/api';

export const authApi = {
  // Login with email and password -> returns JWT + User
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Register new account (defaults to STAFF)
  register: async (data: { email: string; password: string; fullName: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Verify currently logged-in user profile from Bearer token
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
