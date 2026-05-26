import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ── Tokens (mesmo sistema dos outros arquivos) ────────────────────────────────
const C = {
  bg:      '#0f172a',
  surface: '#1e293b',
  border:  '#334155',

  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted:     '#64748b',

  blue:   '#3b82f6',
  purple: '#8b5cf6',
  red:    '#ef4444',
};

export const styles = StyleSheet.create({

  // ── Wrapper ───────────────────────────────────────────────────────────────
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

  // ── Logo ──────────────────────────────────────────────────────────────────
  logoWrapper: {
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.purple + '20',
    borderWidth: 2,
    borderColor: C.purple + '50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoImage: {
    width: 64,
    height: 56,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 13,
    color: C.textMuted,
    fontWeight: '500',
  },

  // ── Card do formulário ────────────────────────────────────────────────────
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

  // ── Inputs ────────────────────────────────────────────────────────────────
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

  // ── Botão Entrar ──────────────────────────────────────────────────────────
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.blue,
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

  // ── Divider ───────────────────────────────────────────────────────────────
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

  // ── Botão Cadastro ────────────────────────────────────────────────────────
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.blue + '15',
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: C.blue + '40',
    gap: 8,
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.blue,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerText: {
    fontSize: 12,
    color: C.textMuted,
  },
});