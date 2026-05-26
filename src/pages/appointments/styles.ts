import { StyleSheet, Platform } from 'react-native';

// ── Tokens (mesmo sistema do adminDashboard) ──────────────────────────────────
const C = {
  bg:          '#0f172a',
  surface:     '#1e293b',
  border:      '#334155',

  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted:     '#64748b',

  blue:   '#3b82f6',
  green:  '#10b981',
  yellow: '#f59e0b',
  red:    '#ef4444',
};

const CARD_RADIUS = 16;
const SECTION_GAP = 28;

export const styles = StyleSheet.create({

  // ── Layout ────────────────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 20,
    marginBottom: 4,
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
  },
  headerAdd: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.blue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.blue + '40',
  },

  // ── Seção ─────────────────────────────────────────────────────────────────
  section: {
    marginBottom: SECTION_GAP,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionBadge: {
    backgroundColor: C.surface,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textSecondary,
  },

  // ── Estado Vazio ──────────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: C.surface,
    borderRadius: CARD_RADIUS,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  emptyText: {
    fontSize: 14,
    color: C.textMuted,
    textAlign: 'center',
  },

  // ── Queue Card ────────────────────────────────────────────────────────────
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: CARD_RADIUS,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  queuePositionBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  queuePositionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  queueInfo: {
    flex: 1,
  },
  queueName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 2,
  },
  queueService: {
    fontSize: 13,
    color: C.textSecondary,
    marginBottom: 4,
  },
  queueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  queueTime: {
    fontSize: 13,
    color: C.green,
    fontWeight: '600',
  },

  // ── Status Pill ───────────────────────────────────────────────────────────
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    flexShrink: 0,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  // ✅ CORRIGIDO: cor dinâmica via prop — sem hardcode
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Appointment Card ──────────────────────────────────────────────────────
  appointmentCard: {
    backgroundColor: C.surface,
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  apptCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  apptServiceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  apptDescription: {
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  apptMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  apptMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  apptMetaText: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: '500',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.red + '50',
    backgroundColor: C.red + '12',
    gap: 6,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.red,
  },

  // ── Modal ─────────────────────────────────────────────────────────────────
  modalWrapper: {
    flex: 1,
    backgroundColor: C.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    paddingBottom: 18,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // ── Formulário ────────────────────────────────────────────────────────────
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  pickerWrapper: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  picker: {
    color: C.textPrimary,
    backgroundColor: 'transparent',
  },
  textArea: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: C.textPrimary,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  datePickerText: {
    flex: 1,
    fontSize: 15,
    color: C.textPrimary,
    fontWeight: '500',
  },

  // ── Info Box ──────────────────────────────────────────────────────────────
  infoBox: {
    flexDirection: 'row',
    backgroundColor: C.blue + '12',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: C.blue,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.blue,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 20,
  },

  // ── Botões do modal ───────────────────────────────────────────────────────
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: C.blue,
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});