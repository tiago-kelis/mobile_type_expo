import { dark } from './dark';
import { light } from './light';

export type Theme = typeof dark;
export type ThemeMode = 'dark' | 'light';

export const themes: Record<ThemeMode, Theme> = { dark, light };

export { dark, light };

// ── Helpers reutilizáveis que dependem do tema ────────────────────────────────

export function getStatusColor(theme: Theme, status: string): string {
  switch (status) {
    case 'agendado':        return theme.statusAgendado;
    case 'em_atendimento':  return theme.statusEmAtendimento;
    case 'concluido':       return theme.statusConcluido;
    case 'cancelado':       return theme.statusCancelado;
    default:                return theme.textMuted;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'agendado':        return 'Agendado';
    case 'em_atendimento':  return 'Em Atendimento';
    case 'concluido':       return 'Concluído';
    case 'cancelado':       return 'Cancelado';
    default:                return status;
  }
}