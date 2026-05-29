import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_RADIUS  = 16;
const SECTION_GAP  = 28;
const MENU_CARD_WIDTH = (width - 40 - 12) / 2;

export const makeStyles = (C: Theme) =>
  StyleSheet.create({

    // ── Redirect ──────────────────────────────────────────────────────────────
    redirectScreen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: C.bg,
    },
    redirectText: {
      fontSize: 16,
      color: C.textSecondary,
    },

    // ── Layout ────────────────────────────────────────────────────────────────
    screen: {
      flex: 1,
      backgroundColor: C.bg,
    },
    container: {
      paddingHorizontal: 20,
      paddingBottom: 60,
    },

    // ── Header ────────────────────────────────────────────────────────────────
    header: {
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 20,
      marginTop: Platform.OS === 'ios' ? 56 : 44,
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
      marginBottom: 3,
    },
    userEmail: {
      fontSize: 13,
      color: C.textMuted,
      marginBottom: 10,
    },
    userBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.teal + '20',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: 'flex-start',
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
    headerInfoBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: C.border,
      gap: 8,
    },
    headerInfoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    headerInfoText: {
      fontSize: 12,
      color: C.textMuted,
      fontWeight: '500',
    },

    // ── Seção ─────────────────────────────────────────────────────────────────
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

    // ── Menu Grid ─────────────────────────────────────────────────────────────
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    menuCard: {
      width: MENU_CARD_WIDTH,
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 18,
      borderWidth: 1,
      borderColor: C.border,
      position: 'relative',
      minHeight: 140,
    },
    menuCardDisabled: {
      opacity: 0.5,
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
      paddingRight: 20,
    },
    menuArrow: {
      position: 'absolute',
      bottom: 14,
      right: 14,
    },

    // ── Ações Rápidas ─────────────────────────────────────────────────────────
    quickAction: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: C.border,
    },
    quickActionIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    quickActionText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: C.textPrimary,
    },

    // ── Stats ─────────────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: 10,
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

    // ── Logout ────────────────────────────────────────────────────────────────
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

    // ── Footer ────────────────────────────────────────────────────────────────
    footerText: {
      textAlign: 'center',
      fontSize: 12,
      color: C.textMuted,
      marginBottom: 10,
    },
  });