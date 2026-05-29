import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../../theme';

const CARD_RADIUS = 16;
const SECTION_GAP = 24;

export const makeStyles = (C: Theme) =>
  StyleSheet.create({

    screen: { flex: 1, backgroundColor: C.bg },
    container: { paddingHorizontal: 20, paddingBottom: 40 },

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
      backgroundColor: C.blue + '20',
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1, borderColor: C.blue + '40',
    },

    // ── Resumo ───────────────────────────────────────────────────────────────
    summaryRow: {
      flexDirection: 'row', gap: 10, marginBottom: SECTION_GAP,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1, borderColor: C.border,
      gap: 4,
    },
    summaryDot: {
      width: 8, height: 8, borderRadius: 4,
      backgroundColor: '#10b981',
    },
    summaryValue: {
      fontSize: 24, fontWeight: '800',
    },
    summaryLabel: {
      fontSize: 11, color: C.textMuted,
      fontWeight: '600', textTransform: 'uppercase',
    },

    // ── Seção ────────────────────────────────────────────────────────────────
    section: { marginBottom: SECTION_GAP },
    sectionTitle: {
      fontSize: 12, fontWeight: '700',
      color: C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2, marginBottom: 14,
    },

    // ── Duty Card ────────────────────────────────────────────────────────────
    dutyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.green + '12',
      borderRadius: CARD_RADIUS,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: C.green + '30',
      gap: 12,
    },
    dutyIndicator: {
      width: 8, height: 8, borderRadius: 4,
      backgroundColor: C.green, flexShrink: 0,
    },

    // ── Empty ────────────────────────────────────────────────────────────────
    emptyCard: {
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      paddingVertical: 48,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1, borderColor: C.border,
    },
    emptyText: {
      fontSize: 15, color: C.textMuted, textAlign: 'center',
    },
    emptyBtn: {
      backgroundColor: C.blue + '20',
      borderRadius: 10,
      paddingHorizontal: 16, paddingVertical: 10,
      borderWidth: 1, borderColor: C.blue + '40',
      marginTop: 4,
    },
    emptyBtnText: {
      fontSize: 14, fontWeight: '700', color: C.blue,
    },

    // ── Prof Card ────────────────────────────────────────────────────────────
    profCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1, borderColor: C.border,
      gap: 12,
    },
    profCardInactive: { opacity: 0.55 },
    profAvatar: {
      width: 50, height: 50, borderRadius: 25,
      justifyContent: 'center', alignItems: 'center',
      flexShrink: 0,
      borderWidth: 1, borderColor: C.border,
    },
    profName: {
      fontSize: 15, fontWeight: '700',
      color: C.textPrimary, marginBottom: 2,
    },
    profSpec: {
      fontSize: 13, color: C.textSecondary, marginBottom: 2,
    },
    profCrm: {
      fontSize: 11, color: C.textMuted,
      fontWeight: '500', marginBottom: 4,
    },
    profBadgeRow: {
      flexDirection: 'row', gap: 6, flexWrap: 'wrap',
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8, paddingVertical: 3,
      borderRadius: 8, gap: 4,
    },
    badgeDot: {
      width: 6, height: 6, borderRadius: 3,
    },
    badgeText: {
      fontSize: 11, fontWeight: '700',
    },
    profActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6, flexShrink: 0,
    },
    iconBtn: {
      width: 32, height: 32, borderRadius: 10,
      justifyContent: 'center', alignItems: 'center',
    },

    // ── Modal base ───────────────────────────────────────────────────────────
    modalWrapper: { flex: 1, backgroundColor: C.bg },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 24,
      paddingBottom: 18,
      backgroundColor: C.surface,
      borderBottomWidth: 1, borderBottomColor: C.border,
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
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: C.blue,
      flexDirection: 'row', gap: 8,
    },
    modalSaveText: {
      fontSize: 15, fontWeight: '700', color: '#fff',
    },

    // ── Form ─────────────────────────────────────────────────────────────────
    inputGroup: { marginBottom: 20 },

    // ✅ label com botão ao lado
    inputLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    inputLabel: {
      fontSize: 12, fontWeight: '700',
      color: C.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    input: {
      backgroundColor: C.surface,
      borderWidth: 1, borderColor: C.border,
      borderRadius: 12,
      paddingHorizontal: 16, paddingVertical: 14,
      fontSize: 15, color: C.textPrimary,
    },

    // ── Botão "Nova" especialidade ao lado do label ───────────────────────────
    addSpecBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.purple + '20',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      gap: 4,
    },
    addSpecBtnText: {
      fontSize: 12, fontWeight: '700', color: C.purple,
    },

    // ── Estado vazio especialidade ────────────────────────────────────────────
    emptySpecCard: {
      backgroundColor: C.surface,
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1, borderColor: C.border,
      gap: 8,
    },
    emptySpecText: {
      fontSize: 13, color: C.textMuted, textAlign: 'center',
    },

    // ── Lista de especialidades (radio) ───────────────────────────────────────
    specList: {
      maxHeight: 260,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: C.border,
      overflow: 'hidden',
    },
    specRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      gap: 12,
      backgroundColor: C.surface,
    },
    specRadio: {
      width: 20, height: 20, borderRadius: 10,
      borderWidth: 2, borderColor: C.border,
      justifyContent: 'center', alignItems: 'center',
      flexShrink: 0,
    },
    specRadioDot: {
      width: 8, height: 8, borderRadius: 4,
      backgroundColor: '#fff',
    },
    specName: {
      fontSize: 14, color: C.textPrimary, flex: 1,
    },

    // ── Modal especialidades — adicionar nova ─────────────────────────────────
    addSpecRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    addSpecConfirmBtn: {
      width: 50, height: 50,
      borderRadius: 12,
      backgroundColor: C.purple,
      justifyContent: 'center', alignItems: 'center',
      flexShrink: 0,
    },

    // ── Lista no modal de especialidades ─────────────────────────────────────
    specListRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: 10,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1, borderColor: C.border,
      gap: 10,
    },
    specListName: {
      fontSize: 14, color: C.textPrimary, fontWeight: '500',
    },
    serviceChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.teal + '15',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginRight: 6,
      borderWidth: 1,
      borderColor: C.teal + '30',
      gap: 4,
    },
    serviceChipText: {
      fontSize: 11,
      color: C.teal,
      fontWeight: '600',
    },
  });