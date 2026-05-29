import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../../theme';

const CARD_RADIUS = 16;
const SECTION_GAP = 24;

export const makeStyles = (C: Theme) =>
  StyleSheet.create({

    // ── Layout ────────────────────────────────────────────────────────────────
    screen:    { flex: 1, backgroundColor: C.bg },
    container: { paddingHorizontal: 20, paddingBottom: 40 },

    // ── Header ────────────────────────────────────────────────────────────────
    header: {
      flexDirection:  'row',
      alignItems:     'flex-start',
      paddingTop:     Platform.OS === 'ios' ? 56 : 44,
      paddingBottom:  20,
    },
    greeting:  { fontSize: 14, color: C.textSecondary, marginBottom: 2 },
    userName:  { fontSize: 22, fontWeight: '700', color: C.textPrimary, marginBottom: 2 },
    specialty: { fontSize: 14, color: C.textMuted, marginBottom: 8 },
    badge: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: C.blue + '20',
      borderRadius:    20,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf:       'flex-start',
      gap:             5,
      borderWidth:     1,
      borderColor:     C.blue + '40',
    },
    badgeText: {
      color:        C.blue,
      fontSize:     11,
      fontWeight:   '700',
      letterSpacing: 0.8,
    },
    logoutIcon: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: C.red + '15',
      justifyContent:  'center',
      alignItems:      'center',
      borderWidth:     1,
      borderColor:     C.red + '30',
    },

    // ── Plantão ───────────────────────────────────────────────────────────────
    dutyCard: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: C.surface,
      borderRadius:    CARD_RADIUS,
      padding:         16,
      marginBottom:    SECTION_GAP,
      borderWidth:     1.5,
      gap:             12,
    },
    dutyTitle:    { fontSize: 15, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
    dutySubtitle: { fontSize: 12, color: C.textSecondary },

    // ── Resumo ────────────────────────────────────────────────────────────────
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: SECTION_GAP },
    summaryCard: {
      flex:            1,
      backgroundColor: C.surface,
      borderRadius:    CARD_RADIUS,
      paddingVertical: 16,
      alignItems:      'center',
      borderWidth:     1,
      borderColor:     C.border,
      gap:             4,
    },
    summaryValue: { fontSize: 24, fontWeight: '800' },
    summaryLabel: {
      fontSize:      11,
      color:         C.textMuted,
      fontWeight:    '600',
      textTransform: 'uppercase',
    },

    // ── Seção ─────────────────────────────────────────────────────────────────
    section: { marginBottom: SECTION_GAP },
    sectionTitle: {
      fontSize:      12,
      fontWeight:    '700',
      color:         C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom:  14,
    },

    // ── Empty ─────────────────────────────────────────────────────────────────
    emptyCard: {
      backgroundColor: C.surface,
      borderRadius:    CARD_RADIUS,
      paddingVertical: 36,
      alignItems:      'center',
      gap:             10,
      borderWidth:     1,
      borderColor:     C.border,
    },
    emptyText: { fontSize: 14, color: C.textMuted },

    // ── Appointment card ──────────────────────────────────────────────────────
    apptCard: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: C.surface,
      borderRadius:    CARD_RADIUS,
      padding:         14,
      marginBottom:    8,
      borderWidth:     1,
      borderColor:     C.border,
      gap:             12,
    },
    apptTimeBadge: {
      borderRadius: 10,
      padding:      10,
      alignItems:   'center',
      minWidth:     60,
      flexShrink:   0,
    },
    apptTime:    { fontSize: 16, fontWeight: '700' },
    apptDate:    { fontSize: 11, marginTop: 2 },
    apptPatient: { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 2 },
    apptService: { fontSize: 12, color: C.textSecondary, marginBottom: 2 },
    apptDesc:    { fontSize: 11, color: C.textMuted, fontStyle: 'italic' },
    statusDot:   { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },

    // ── Agenda ────────────────────────────────────────────────────────────────
    scheduleRow: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: C.surface,
      borderRadius:    12,
      padding:         14,
      marginBottom:    8,
      borderWidth:     1,
      borderColor:     C.border,
    },
    scheduleDate:      { fontSize: 14, fontWeight: '600', color: C.textPrimary, marginBottom: 2 },
    scheduleSub:       { fontSize: 12, color: C.textMuted },
    scheduleStats:     { flexDirection: 'row', gap: 6 },
    scheduleBadge:     { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
    scheduleBadgeText: { fontSize: 11, fontWeight: '700' },

    // ── Serviços ──────────────────────────────────────────────────────────────
    servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    serviceChip: {
      flexDirection:    'row',
      alignItems:       'center',
      borderRadius:     20,
      paddingHorizontal: 12,
      paddingVertical:  6,
      gap:              6,
    },
    serviceChipText: { fontSize: 13, fontWeight: '600' },

    // ── Modais ────────────────────────────────────────────────────────────────
    modalWrapper: { flex: 1, backgroundColor: C.bg },
    modalHeader: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'space-between',
      paddingHorizontal: 20,
      paddingTop:      Platform.OS === 'ios' ? 56 : 44,
      paddingBottom:   16,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    modalTitle:    { fontSize: 17, fontWeight: '700', color: C.textPrimary },
    modalCloseBtn: {
      width:           36,
      height:          36,
      borderRadius:    18,
      backgroundColor: C.surface,
      justifyContent:  'center',
      alignItems:      'center',
    },
    modalScroll: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

    // ── Form ──────────────────────────────────────────────────────────────────
    inputLabel: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
    inputRow: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: C.surface,
      borderRadius:    12,
      borderWidth:     1,
      borderColor:     C.border,
      paddingHorizontal: 12,
      height:          52,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: C.textPrimary },
    textArea: {
      backgroundColor: C.surface,
      borderRadius:    12,
      borderWidth:     1,
      borderColor:     C.border,
      padding:         14,
      fontSize:        14,
      color:           C.textPrimary,
      lineHeight:      22,
    },

    // ── Botões modal ──────────────────────────────────────────────────────────
    modalActions: { flexDirection: 'row', gap: 12 },
    modalCancelBtn: {
      flex:            1,
      paddingVertical: 14,
      borderRadius:    12,
      alignItems:      'center',
      backgroundColor: C.surface,
      borderWidth:     1,
      borderColor:     C.border,
    },
    modalCancelText:  { fontSize: 15, fontWeight: '600', color: C.textSecondary },
    modalConfirmBtn: {
      flex:            2,
      flexDirection:   'row',
      paddingVertical: 14,
      borderRadius:    12,
      alignItems:      'center',
      justifyContent:  'center',
      gap:             8,
      backgroundColor: C.blue,
    },
    modalConfirmText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  });