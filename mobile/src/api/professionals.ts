import { api } from './client';

export interface Professional {
  id:             number;
  name:           string;
  specialty_id:   number;
  specialty:      string;
  crm?:           string;
  active:         number;
  on_duty:        number;
  service_ids:    number[];
  service_names:  string[];
  user_id?:       number;   // ✅ vínculo com usuário
  user_approved?: number;   // ✅ 1 = aprovado, 0 = pendente
}

export async function getAllProfessionals(): Promise<Professional[]> {
  const { data } = await api.get<Professional[]>('/professionals');
  return data;
}

export async function getOnDutyProfessionals(): Promise<Professional[]> {
  const { data } = await api.get<Professional[]>('/professionals/on-duty');
  return data;
}

export async function getProfessionalsByService(
  serviceId: number
): Promise<Professional[]> {
  const { data } = await api.get<Professional[]>(
    `/professionals/by-service/${serviceId}`
  );
  return data;
}

export async function createProfessional(payload: {
  name:         string;
  specialty_id: number;
  crm?:         string;
  service_ids?: number[];
}): Promise<{ id: number }> {
  const { data } = await api.post('/professionals', payload);
  return data;
}

export async function updateProfessionalServices(
  id: number,
  service_ids: number[]
): Promise<void> {
  await api.put(`/professionals/${id}/services`, { service_ids });
}

export async function toggleDuty(id: number): Promise<void> {
  await api.patch(`/professionals/${id}/duty`);
}

export async function toggleProfessionalActive(id: number): Promise<void> {
  await api.patch(`/professionals/${id}/active`);
}

export async function deleteProfessional(id: number): Promise<void> {
  await api.delete(`/professionals/${id}`);
}

// ✅ aprovar profissional — muda role para 'professional' e ativa o cadastro
export async function approveProfessional(id: number): Promise<void> {
  await api.patch(`/professionals/${id}/approve`);
}