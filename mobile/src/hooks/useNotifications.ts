import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Appointment } from '../api/appointments';

// ── Configuração global ───────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldPlaySound:  true,
    shouldSetBadge:   false,
    shouldShowBanner: true,
    shouldShowList:   true,
  }),
});

// Minutos antes que disparam notificação
const ALERT_MINUTES = [60, 45, 30, 20, 10, 0];

function minutesBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 60000);
}

async function requestPermission(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';

}

async function scheduleForAppointment(
  appointment: Appointment
): Promise<string[]> {
  const ids: string[] = [];

  const [h, min, s] = appointment.scheduled_time.split(':').map(Number);
  const apptDate = new Date(appointment.scheduled_date + 'T00:00:00');
  apptDate.setHours(h, min, s || 0, 0);

  const now = new Date();

  for (const minutesBefore of ALERT_MINUTES) {
    const triggerDate = new Date(apptDate.getTime() - minutesBefore * 60000);

    if (triggerDate <= now) continue; // já passou

    const body =
      minutesBefore === 0
        ? '🏥 É a sua vez! Dirija-se ao atendimento agora.'
        : `🕐 Faltam ${minutesBefore} minuto${minutesBefore > 1 ? 's' : ''} para o seu atendimento.`;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'SmartClínica',
        body,
        data: { appointmentId: appointment.id },
      },
      trigger: {
        date: triggerDate,
      } as any,
    });

    ids.push(id);
  }

  return ids;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useNotifications(appointments: Appointment[]) {
  const scheduledRef = useRef<Record<number, string[]>>({});

  // Solicitar permissão uma vez
  useEffect(() => {
    requestPermission();

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name:       'Lembretes de Consulta',
        importance: Notifications.AndroidImportance.HIGH,
        sound:      'default',
      });
    }
  }, []);

  // Agendar notificações para novos agendamentos
  useEffect(() => {
    appointments.forEach(async (appt) => {
      if (
        appt.status !== 'agendado' &&
        appt.status !== 'em_atendimento'
      ) return;

      // Já agendado — pular
      if (scheduledRef.current[appt.id]) return;

      const ids = await scheduleForAppointment(appt);
      if (ids.length > 0) {
        scheduledRef.current[appt.id] = ids;
        console.log(
          `🔔 ${ids.length} notificações agendadas para appt #${appt.id}`
        );
      }
    });
  }, [appointments]);

  // Cancelar notificações quando agendamento é cancelado/concluído
  useEffect(() => {
    appointments.forEach(async (appt) => {
      if (
        appt.status === 'cancelado' ||
        appt.status === 'concluido'
      ) {
        const ids = scheduledRef.current[appt.id];
        if (ids) {
          await Promise.all(ids.map(Notifications.cancelScheduledNotificationAsync));
          delete scheduledRef.current[appt.id];
          console.log(`🔕 Notificações canceladas para appt #${appt.id}`);
        }
      }
    });
  }, [appointments]);

  const cancelAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    scheduledRef.current = {};
  };

  return { cancelAll };
}