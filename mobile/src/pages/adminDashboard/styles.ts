import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');
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
      paddingTop: Platform.OS === 'ios' ? 56 : 44,
      paddingBottom: 60,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 20,
      marginBottom: SECTION_GAP,
      borderWidth: 1,
      borderColor: C.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    greeting: {
      fontSize: 14,
      color: C.textSecondary,
      marginBottom: 2,
    },
    userName: {
      fontSize: 22,
      fontWeight: '700',
      color: C.textPrimary,
      marginBottom: 10,
    },
    adminBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.blue + '25',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: C.blue + '40',
    },
    adminBadgeText: {
      color: C.blue,
      fontSize: 11,
      fontWeight: '700',
      marginLeft: 5,
      letterSpacing: 0.8,
    },
    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: C.blue + '15',
      borderWidth: 1,
      borderColor: C.blue + '40',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: C.blue + '15',
      borderWidth: 2,
      borderColor: C.blue + '40',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerStatusBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: C.border,
    },
    headerStatusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    headerStatusText: {
      fontSize: 13,
      color: C.textSecondary,
      fontWeight: '500',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    // ── Profissionais de Plantão ─────────────────────────────────────────────
    professionalChip: {
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
    professionalChipDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: C.green,
    },
    professionalChipName: {
      fontSize: 13,
      fontWeight: '700',
      color: C.textPrimary,
    },
    professionalChipSpec: {
      fontSize: 11,
      color: C.textSecondary,
    },

    // ── Seção ────────────────────────────────────────────────────────────────
    section: {
      marginBottom: SECTION_GAP,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 14,
    },

    // ── Stat Cards ───────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      paddingVertical: 16,
      paddingHorizontal: 8,
      alignItems: 'center',
      borderTopWidth: 3,
      borderWidth: 1,
      borderColor: C.border,
    },
    statValue: {
      fontSize: 26,
      fontWeight: '800',
      marginTop: 8,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 11,
      color: C.textSecondary,
      textAlign: 'center',
      fontWeight: '500',
    },

    // ── Menu Grid ────────────────────────────────────────────────────────────
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    menuCard: {
      width: (width - 52) / 2,
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 18,
      borderWidth: 1,
      borderColor: C.border,
      position: 'relative',
      minHeight: 130,
    },
    menuIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    menuCardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: C.textPrimary,
      marginBottom: 4,
    },
    menuCardSub: {
      fontSize: 12,
      color: C.textSecondary,
      lineHeight: 16,
    },
    menuArrow: {
      position: 'absolute',
      bottom: 14,
      right: 14,
    },

    // ── Logout ───────────────────────────────────────────────────────────────
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: C.red + '50',
      backgroundColor: C.red + '10',
      marginBottom: 20,
      gap: 10,
    },
    logoutText: {
      fontSize: 15,
      fontWeight: '700',
      color: C.red,
    },
    footerText: {
      textAlign: 'center',
      fontSize: 12,
      color: C.textMuted,
      marginBottom: 20,
    },

    // ── Modal ────────────────────────────────────────────────────────────────
    modalWrapper: {
      flex: 1,
      backgroundColor: C.bg,
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
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: C.textPrimary,
    },
    modalCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalScroll: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    modalCentered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 80,
      gap: 12,
    },
    emptyText: {
      fontSize: 15,
      color: C.textMuted,
      textAlign: 'center',
    },
    modalSummaryBar: {
      flexDirection: 'row',
      backgroundColor: C.surface,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    modalSummaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    modalSummaryValue: {
      fontSize: 22,
      fontWeight: '800',
      marginBottom: 2,
    },
    modalSummaryLabel: {
      fontSize: 12,
      color: C.textSecondary,
      fontWeight: '500',
    },
    modalSummarySep: {
      width: 1,
      backgroundColor: C.border,
      marginVertical: 4,
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
      marginBottom: 12,
    },
    queueBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    queueBadgeText: {
      fontSize: 12,
      fontWeight: '800',
      color: '#fff',
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      gap: 6,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    statusPillText: {
      fontSize: 12,
      fontWeight: '700',
    },
    apptUserName: {
      fontSize: 16,
      fontWeight: '700',
      color: C.textPrimary,
      marginBottom: 3,
    },
    apptService: {
      fontSize: 14,
      fontWeight: '600',
      color: C.blue,
      marginBottom: 6,
    },
    apptProfRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 6,
    },
    apptMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 4,
    },
    apptMetaText: {
      fontSize: 13,
      color: C.textSecondary,
    },
    apptDescription: {
      fontSize: 13,
      color: C.textMuted,
      fontStyle: 'italic',
      marginBottom: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: C.border,
    },
    apptActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: C.border,
      flexWrap: 'wrap',
    },
    apptActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      gap: 6,
    },
    apptActionBtnText: {
      fontSize: 13,
      fontWeight: '700',
    },
  });