import { api } from './client';

export interface ProfessionalProfile {
  id:             number;
  name:           string;
  specialty_id?:  number;   // ✅ novo
  specialty_name: string;
  crm?:           string;
  active:         number;
  on_duty:        number;
  service_names:  string[];
}

export interface ScheduleDay {
  date:           string;
  total:          number;
  agendados:      number;
  em_atendimento: number;
  concluidos:     number;
}

export interface Specialty {
  id:   number;
  name: string;
}

export async function getMyProfessionalProfile(): Promise<ProfessionalProfile> {
  const { data } = await api.get('/professional-portal/me');
  return data;
}

export async function getMyProfessionalAppointments() {
  const { data } = await api.get('/professional-portal/appointments');
  return data;
}

export async function getMySchedule(): Promise<ScheduleDay[]> {
  const { data } = await api.get('/professional-portal/schedule');
  return data;
}

export async function toggleMyDuty(): Promise<{ on_duty: number }> {
  const { data } = await api.patch('/professional-portal/duty');
  return data;
}

export async function getMyQueue() {
  const { data } = await api.get('/professional-portal/queue');
  return data;
}

export async function sendPrescription(payload: {
  appointment_id: number;
  content:        string;
}): Promise<void> {
  await api.post('/professional-portal/prescription', payload);
}

export async function setDelay(delay_minutes: number): Promise<{
  affected:      number;
  delay_minutes: number;
}> {
  const { data } = await api.post('/professional-portal/delay', { delay_minutes });
  return data;
}

// ✅ buscar especialidades disponíveis
export async function getSpecialtiesForPortal(): Promise<Specialty[]> {
  const { data } = await api.get('/specialties');
  return data;
}

// ✅ atualizar especialidade do profissional
export async function updateMySpecialty(specialty_id: number): Promise<void> {
  await api.patch('/professional-portal/specialty', { specialty_id });
}

// ✅ buscar serviços disponíveis
// ✅ correto
export async function getServicesForPortal() {
  const { data } = await api.get('/services');
  return data;
}

// ✅ atualizar serviços do profissional
export async function updateMyServices(service_ids: number[]): Promise<void> {
  await api.put('/professional-portal/services', { service_ids });
}