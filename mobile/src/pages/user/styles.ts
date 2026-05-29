import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../../theme';

const CARD_RADIUS = 16;

export const makeStyles = (C: Theme) =>
  StyleSheet.create({

    // ── Layout ──────────────────────────────────────────────────────────────
    keyboardView: {
      flex: 1,
      backgroundColor: C.bg,
    },
    screen: {
      flex: 1,
      backgroundColor: C.bg,
    },
    container: {
      paddingHorizontal: 24,
      paddingTop: Platform.OS === 'ios' ? 60 : 48,
      paddingBottom: 40,
      alignItems: 'center',
    },

    // ── Header ──────────────────────────────────────────────────────────────
    headerSection: {
      alignItems: 'center',
      marginBottom: 28,
      gap: 8,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: C.teal + '15',
      borderWidth: 2,
      borderColor: C.teal + '40',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: C.textPrimary,
      letterSpacing: 0.3,
    },
    subtitle: {
      fontSize: 14,
      color: C.textMuted,
      fontWeight: '500',
      textAlign: 'center',
    },

    // ── Card ────────────────────────────────────────────────────────────────
    card: {
      width: '100%',
      maxWidth: 420,
      backgroundColor: C.surface,
      borderRadius: CARD_RADIUS,
      padding: 24,
      borderWidth: 1,
      borderColor: C.border,
      marginBottom: 16,
    },

    // ── Input Group ─────────────────────────────────────────────────────────
    inputGroup: {
      marginBottom: 18,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: C.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.bg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: C.border,
      paddingHorizontal: 14,
      height: 50,
    },
    inputRowError: {
      borderColor: C.red,
      borderWidth: 1.5,
    },
    inputIcon: {
      marginRight: 10,
      flexShrink: 0,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: C.textPrimary,
      height: '100%',
    },
    eyeBtn: {
      padding: 4,
      marginLeft: 8,
    },

    // ── Feedback ────────────────────────────────────────────────────────────
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      gap: 5,
    },
    errorText: {
      fontSize: 12,
      color: C.red,
      fontWeight: '500',
      flex: 1,
    },
    hintText: {
      fontSize: 12,
      color: C.textMuted,
      marginTop: 6,
      lineHeight: 16,
    },

    // ── Info Box ────────────────────────────────────────────────────────────
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.teal + '12',
      borderRadius: 10,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: C.teal,
      gap: 10,
      marginTop: 4,
    },
    infoText: {
      fontSize: 13,
      color: C.textSecondary,
      flex: 1,
      lineHeight: 18,
    },

    // ── Botões ──────────────────────────────────────────────────────────────
    primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.teal,
      borderRadius: 12,
      height: 52,
      width: '100%',
      maxWidth: 420,
      marginBottom: 12,
      gap: 8,
    },
    primaryBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    secondaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.surface,
      borderRadius: 12,
      height: 52,
      width: '100%',
      maxWidth: 420,
      borderWidth: 1,
      borderColor: C.border,
      gap: 8,
    },
    secondaryBtnText: {
      color: C.textSecondary,
      fontSize: 15,
      fontWeight: '600',
    },
  });