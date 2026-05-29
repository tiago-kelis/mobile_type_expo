import { api } from './client';

export interface Specialty {
  id:     number;
  name:   string;
  active: number;
}

export async function getSpecialties(): Promise<Specialty[]> {
  const { data } = await api.get<Specialty[]>('/specialties');
  return data;
}

export async function createSpecialty(name: string): Promise<{ id: number }> {
  const { data } = await api.post('/specialties', { name });
  return data;
}

export async function deleteSpecialty(id: number): Promise<void> {
  await api.delete(`/specialties/${id}`);
}