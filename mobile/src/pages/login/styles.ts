import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../../theme';

export const makeStyles = (C: Theme) =>
  StyleSheet.create({

    // ── Wrapper ──────────────────────────────────────────────────────────────
    gradient: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: Platform.OS === 'ios' ? 60 : 48,
      paddingBottom: 40,
      gap: 24,
    },

    // ── Logo ─────────────────────────────────────────────────────────────────
    logoWrapper: {
      alignItems: 'center',
      gap: 10,
    },
    logoCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: C.teal + '25',
      borderWidth: 2,
      borderColor: C.teal + '50',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    logoImage: {
      width: 64,
      height: 56,
    },
    appName: {
      fontSize: 28,
      fontWeight: '800',
      color: '#ffffff',
      letterSpacing: 0.5,
    },
    appTagline: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.6)',
      fontWeight: '500',
      textAlign: 'center',
    },

    // ── Card ─────────────────────────────────────────────────────────────────
    card: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: C.surface,
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: C.border,
      gap: 4,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: C.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },

    // ── Inputs ───────────────────────────────────────────────────────────────
    inputGroup: {
      marginBottom: 16,
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

    // ── Botão Entrar ─────────────────────────────────────────────────────────
    loginBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.teal,
      borderRadius: 12,
      height: 50,
      marginTop: 8,
      gap: 8,
    },
    loginBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fff',
    },

    // ── Divider ──────────────────────────────────────────────────────────────
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      gap: 12,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: C.border,
    },
    dividerText: {
      fontSize: 12,
      color: C.textMuted,
      fontWeight: '600',
    },

    // ── Botão Cadastro ───────────────────────────────────────────────────────
    registerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.teal + '15',
      borderRadius: 12,
      height: 50,
      borderWidth: 1,
      borderColor: C.teal + '40',
      gap: 8,
    },
    registerBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: C.teal,
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    footerText: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.4)',
    },
  });