import { api } from './axios'
import type { AuthResponse, LoginRequest, RegisterRequest, UserDto } from '../types/api'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', credentials)
    return res.data
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', payload)
    return res.data
  },

  getCurrentUser: async (): Promise<UserDto> => {
    const res = await api.get<UserDto>('/auth/me')
    return res.data
  },
}
