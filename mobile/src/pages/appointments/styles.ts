import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../../theme';

const CARD_RADIUS = 16;
const SECTION_GAP = 28;

export const makeStyles = (C: Theme) =>
  StyleSheet.create({

    screen: {
      flex: 1,
      backgroundColor: C.bg,
    },
    container: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    // ── Header ──────────────────────────────────────────────────────────────
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

    // ── Seção ────────────────────────────────────────────────────────────────
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

    // ── Profissionais de Plantão ─────────────────────────────────────────────
    profChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginRight: 10,
      borderWidth: 1,
      borderColor: C.border,
      gap: 8,
    },
    profChipDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: C.green,
    },
    profChipName: {
      fontSize: 13,
      fontWeight: '700',
      color: C.textPrimary,
    },
    profChipSpec: {
      fontSize: 11,
      color: C.textSecondary,
    },

    // ── Estado Vazio ─────────────────────────────────────────────────────────
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

    // ── Queue Card ───────────────────────────────────────────────────────────
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
      marginBottom: 2,
    },
    queueProf: {
      fontSize: 12,
      color: C.teal,
      marginBottom: 4,
      fontWeight: '500',
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

    // ── Status Pill ──────────────────────────────────────────────────────────
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
    statusPillText: {
      fontSize: 11,
      fontWeight: '700',
    },

    // ── Appointment Card ─────────────────────────────────────────────────────
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
    apptProfRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: 8,
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

    // ── Modal ────────────────────────────────────────────────────────────────
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

    // ── Formulário ───────────────────────────────────────────────────────────
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

    // ── Info Box ─────────────────────────────────────────────────────────────
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

    // ── Botões do modal ──────────────────────────────────────────────────────
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
      justifyContent: 'center',
      backgroundColor: C.blue,
    },
    modalConfirmText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#fff',
    },

    // ✅ chips de filtro de serviço
serviceFilterChip: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: C.surface,
  borderRadius: 20,
  paddingHorizontal: 14,
  paddingVertical: 8,
  marginRight: 8,
  borderWidth: 1,
  borderColor: C.border,
  gap: 6,
},
serviceFilterChipActive: {
  backgroundColor: C.blue,
  borderColor: C.blue,
},
serviceFilterChipText: {
  fontSize: 13,
  fontWeight: '600',
  color: C.textSecondary,
},
serviceFilterChipTextActive: {
  color: '#fff',
},
serviceFilterBadge: {
  backgroundColor: C.blue + '30',
  borderRadius: 10,
  paddingHorizontal: 6,
  paddingVertical: 2,
},
serviceFilterBadgeText: {
  fontSize: 11,
  fontWeight: '700',
  color: C.textMuted,
},

// ✅ badge "Você" na fila
youBadge: {
  borderRadius: 8,
  paddingHorizontal: 6,
  paddingVertical: 2,
},
youBadgeText: {
  fontSize: 10,
  fontWeight: '700',
},

// ✅ card auto-atribuição de profissional
    profAutoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.teal + '12',
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: C.teal + '30',
      gap: 12,
    },
    profAutoName: {
      fontSize: 14,
      fontWeight: '700',
      color: C.textPrimary,
      marginBottom: 2,
    },
    profAutoSpec: {
      fontSize: 12,
      color: C.textSecondary,
    },
    profAutoTag: {
      backgroundColor: C.teal + '20',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    profAutoTagText: {
      fontSize: 11,
      fontWeight: '700',
      color: C.teal,
    },

    // ── Passo 1: cards de escolha de serviço ─────────────────────────────────────
    servicePickerSubtitle: {
      fontSize: 14,
      color: C.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
    servicePickerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: C.border,
      gap: 14,
    },
    servicePickerIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    servicePickerName: {
      fontSize: 16,
      fontWeight: '700',
      color: C.textPrimary,
      marginBottom: 4,
    },
    servicePickerDesc: {
      fontSize: 12,
      color: C.textSecondary,
      marginBottom: 6,
      lineHeight: 16,
    },
    servicePickerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    servicePickerMetaText: {
      fontSize: 12,
      color: C.textMuted,
      fontWeight: '500',
    },
    servicePickerMetaDot: {
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor: C.textMuted,
      marginHorizontal: 2,
    },

    // ── Passo 2: banner do serviço selecionado ────────────────────────────────────
    serviceBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 8,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      gap: 12,
    },
    serviceBannerName: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 2,
    },
    serviceBannerDesc: {
      fontSize: 12,
      color: C.textSecondary,
    },
    serviceBannerDuration: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexShrink: 0,
    },
    serviceBannerDurationText: {
      fontSize: 12,
      fontWeight: '700',
    },

    emptyBtn: {
      backgroundColor: C.teal + '20',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: C.teal + '40',
    },
    emptyBtnText: {
      fontSize: 14,
      fontWeight: '700',
      color: C.teal,
    },
  });