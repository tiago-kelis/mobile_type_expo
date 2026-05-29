import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../../theme';

const CARD_RADIUS = 16;
const SECTION_GAP = 24;

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
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 12,
      backgroundColor: C.surface,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1, borderColor: C.border,
    },
    headerTitle: {
      fontSize: 18, fontWeight: '700', color: C.textPrimary,
    },
    addBtn: {
      width: 40, height: 40, borderRadius: 12,
      backgroundColor: C.teal + '20',
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1, borderColor: C.teal + '40',
    },

    // ── Resumo ───────────────────────────────────────────────────────────────
    summaryRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: SECTION_GAP,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
      gap: 4,
    },
    summaryValue: {
      fontSize: 24, fontWeight: '800',
    },
    summaryLabel: {
      fontSize: 11, color: C.textMuted,
      fontWeight: '600', textTransform: 'uppercase',
    },

    // ── Seção ────────────────────────────────────────────────────────────────
    section: {
      marginBottom: SECTION_GAP,
    },
    sectionTitle: {
      fontSize: 12, fontWeight: '700',
      color: C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 14,
    },

    // ── Empty ────────────────────────────────────────────────────────────────
    emptyCard: {
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      paddingVertical: 48,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: C.border,
    },
    emptyText: {
      fontSize: 15, color: C.textMuted, textAlign: 'center',
    },
    emptyBtn: {
      backgroundColor: C.teal + '20',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: C.teal + '40',
      marginTop: 4,
    },
    emptyBtnText: {
      fontSize: 14, fontWeight: '700', color: C.teal,
    },

    // ── Service Card ─────────────────────────────────────────────────────────
    serviceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: C.border,
    },
    serviceCardInactive: {
      opacity: 0.6,
    },
    serviceCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    serviceIconBox: {
      width: 46, height: 46,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    serviceName: {
      fontSize: 15, fontWeight: '700',
      color: C.textPrimary, marginBottom: 3,
    },
    serviceDesc: {
      fontSize: 12, color: C.textSecondary,
      marginBottom: 4, lineHeight: 16,
    },
    serviceMeta: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
    },
    serviceMetaText: {
      fontSize: 12, color: C.textMuted, fontWeight: '500',
    },
    serviceActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    iconBtn: {
      width: 32, height: 32, borderRadius: 10,
      justifyContent: 'center', alignItems: 'center',
    },

    // ── Modal ────────────────────────────────────────────────────────────────
    modalWrapper: {
      flex: 1, backgroundColor: C.bg,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 24,
      paddingBottom: 18,
      backgroundColor: C.surface,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    modalCloseBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: C.border,
      justifyContent: 'center', alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18, fontWeight: '700', color: C.textPrimary,
    },
    modalScroll: {
      flex: 1, paddingHorizontal: 20, paddingTop: 24,
    },

    // ── Form ─────────────────────────────────────────────────────────────────
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 12, fontWeight: '700',
      color: C.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    input: {
      backgroundColor: C.surface,
      borderWidth: 1, borderColor: C.border,
      borderRadius: 12,
      paddingHorizontal: 16, paddingVertical: 14,
      fontSize: 15, color: C.textPrimary,
    },
    inputMultiline: {
      minHeight: 80, textAlignVertical: 'top',
    },

    // ── Modal Buttons ────────────────────────────────────────────────────────
    modalActions: {
      flexDirection: 'row', gap: 12, marginTop: 8,
    },
    modalCancelBtn: {
      flex: 1, paddingVertical: 15,
      borderRadius: 12, alignItems: 'center',
      backgroundColor: C.surface,
      borderWidth: 1, borderColor: C.border,
    },
    modalCancelText: {
      fontSize: 15, fontWeight: '700', color: C.textSecondary,
    },
    modalSaveBtn: {
      flex: 1, paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.teal,
      flexDirection: 'row', gap: 8,
    },
    modalSaveText: {
      fontSize: 15, fontWeight: '700', color: '#fff',
    },
  });