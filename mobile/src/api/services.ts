import { api } from './client';

export interface Service {
  id:           number;
  name:         string;
  description?: string;
  duration_min: number;
  active:       number;
}

export async function getActiveServices(): Promise<Service[]> {
  const { data } = await api.get<Service[]>('/services');
  return data;
}

export async function getAllServices(): Promise<Service[]> {
  const { data } = await api.get<Service[]>('/services/all');
  return data;
}

export async function createService(payload: {
  name: string;
  description?: string;
  duration_min?: number;
}): Promise<{ id: number }> {
  const { data } = await api.post('/services', payload);
  return data;
}

export async function updateService(
  id: number,
  payload: { name: string; description?: string; duration_min?: number }
): Promise<void> {
  await api.put(`/services/${id}`, payload);
}

export async function toggleServiceActive(id: number): Promise<void> {
  await api.patch(`/services/${id}/active`);
}

export async function deleteService(id: number): Promise<void> {
  await api.delete(`/services/${id}`);
}