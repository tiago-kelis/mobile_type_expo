import { api } from './client';
import { AuthUser } from '../contexts/AuthContext';

interface LoginResponse {
  token: string;
  user:  AuthUser;
}

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<{ id: number }> {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
}

export async function loginWithCrm(
  crm: string,
  password: string
): Promise<{ user: any; token: string }> {
  const { data } = await api.post('/auth/login', { crm, password });
  return data;
}