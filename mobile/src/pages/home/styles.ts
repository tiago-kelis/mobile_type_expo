import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../../theme';

const CARD_RADIUS = 16;
const SECTION_GAP = 20;

export const makeStyles = (C: Theme) =>
  StyleSheet.create({

    // ── Layout ──────────────────────────────────────────────────────────────
    screen: {
      flex: 1,
      backgroundColor: C.bg,
    },
    container: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 56 : 44,
      paddingBottom: 60,
    },

    // ── Botão Voltar ────────────────────────────────────────────────────────
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: C.surface,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginBottom: SECTION_GAP,
      borderWidth: 1,
      borderColor: C.border,
      gap: 8,
    },
    backButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: C.blue,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      paddingVertical: 28,
      paddingHorizontal: 20,
      marginBottom: SECTION_GAP,
      borderWidth: 1,
      borderColor: C.border,
    },
    avatarCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: C.teal + '15',
      borderWidth: 2,
      borderColor: C.teal + '40',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    welcomeText: {
      fontSize: 14,
      color: C.textSecondary,
      marginBottom: 4,
    },
    userName: {
      fontSize: 22,
      fontWeight: '700',
      color: C.textPrimary,
      marginBottom: 10,
    },
    userBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.teal + '20',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: C.teal + '40',
      gap: 5,
    },
    userBadgeText: {
      color: C.teal,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
    },

    // ── Info Card ────────────────────────────────────────────────────────────
    infoCard: {
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 20,
      marginBottom: SECTION_GAP,
      borderWidth: 1,
      borderColor: C.border,
    },
    cardTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 18,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 14,
    },
    infoIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: C.teal + '15',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 11,
      color: C.textMuted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    infoValue: {
      fontSize: 15,
      color: C.textPrimary,
      fontWeight: '600',
    },
    infoDivider: {
      height: 1,
      backgroundColor: C.border,
    },

    // ── Ações ────────────────────────────────────────────────────────────────
    actionsContainer: {
      marginBottom: SECTION_GAP,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: C.border,
    },
    actionIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    actionBtnText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: C.textPrimary,
    },

    // ── Stats ────────────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: SECTION_GAP,
    },
    statCard: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      paddingVertical: 18,
      paddingHorizontal: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
      gap: 6,
    },
    statIconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statValue: {
      fontSize: 14,
      fontWeight: '700',
      color: C.textPrimary,
    },
    statLabel: {
      fontSize: 11,
      color: C.textMuted,
      textAlign: 'center',
      fontWeight: '500',
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
      marginBottom: 24,
      gap: 10,
    },
    logoutText: {
      fontSize: 15,
      fontWeight: '700',
      color: C.red,
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    footerText: {
      textAlign: 'center',
      fontSize: 12,
      color: C.textMuted,
      marginBottom: 10,
    },
  });