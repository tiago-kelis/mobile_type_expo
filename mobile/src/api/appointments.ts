import { api } from './client';

export interface Appointment {
  id:                number;
  user_id:           number;
  user_name:         string;
  user_email:        string;
  professional_id?:  number;
  professional_name?: string;
  service_id:        number;
  service_name:      string;
  duration_min?:     number;   // ✅ útil para exibir duração
  description?:      string;
  status:            'agendado' | 'em_atendimento' | 'concluido' | 'cancelado';
  queue_position:    number;
  scheduled_date:    string;
  scheduled_time:    string;
  created_at:        string;
  attended_at?:      string;
}

export interface AppointmentStats {
  total:          number;
  agendados:      number;
  em_atendimento: number;
  concluidos:     number;
  hoje:           number;
}

export async function getQueueByDate(date: string): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>(`/appointments/date/${date}`);
  return data;
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>('/appointments/me');
  return data;
}

export async function createAppointment(payload: {
  service_id:       number;
  professional_id?: number;
  description?:     string;
  scheduled_date:   string;
  scheduled_time:   string;
}): Promise<{ id: number; queue_position: number }> {
  const { data } = await api.post('/appointments', payload);
  return data;
}

export async function updateAppointmentStatus(
  id: number,
  status: 'agendado' | 'em_atendimento' | 'concluido' | 'cancelado'
): Promise<void> {
  await api.patch(`/appointments/${id}/status`, { status });
}

export async function getAppointmentStats(): Promise<AppointmentStats> {
  const { data } = await api.get<AppointmentStats>('/appointments/stats');
  return data;
}

// ✅ histórico — concluídos e cancelados (admin)
export async function getAppointmentHistory(limit = 100): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>(`/appointments/history?limit=${limit}`);
  return data;
}