import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { makeStyles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../routers/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { loginApi } from '../../api/auth';
import { api } from '../../api/client';

const imageLogo = require('../../../assets/login.png');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type Tab        = 'login' | 'paciente' | 'profissional';
type ProfSubTab = 'entrar' | 'cadastrar';

export default function Login() {
  const navigation        = useNavigation<LoginScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { signIn }        = useAuth();
  const styles            = makeStyles(theme);

  // ── abas ───────────────────────────────────────────────────────────────────
  const [tab, setTab]               = useState<Tab>('login');
  const [profSubTab, setProfSubTab] = useState<ProfSubTab>('entrar');

  // ── campos login paciente ──────────────────────────────────────────────────
  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [showPass, setShowPass] = useState(false);

  // ── campos cadastro paciente ───────────────────────────────────────────────
  const [pName,     setPName]     = useState('');
  const [pEmail,    setPEmail]    = useState('');
  const [pSenha,    setPSenha]    = useState('');
  const [showPPass, setShowPPass] = useState(false);

  // ── campos profissional (login + cadastro) ─────────────────────────────────
  const [prName,      setPrName]      = useState('');
  const [prEmail,     setPrEmail]     = useState('');
  const [prCrm,       setPrCrm]       = useState('');
  const [prSenha,     setPrSenha]     = useState('');
  const [showPrPass,  setShowPrPass]  = useState(false);

  const [loading, setLoading] = useState(false);

  // ── login paciente / admin ─────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha');
      return;
    }
    setLoading(true);
    try {
      const { user, token } = await loginApi(email.trim(), senha);
      await signIn(user, token);

      if (user.role === 'admin') {
        navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard', params: { user } }] });
      } else if (user.role === 'professional') {
        navigation.reset({ index: 0, routes: [{ name: 'ProfessionalDashboard', params: { user } }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Dashboard', params: { user } }] });
      }
    } catch (error: any) {
      Alert.alert(
        'Erro ao entrar',
        error.message === 'Credenciais inválidas'
          ? 'E-mail ou senha incorretos'
          : 'Não foi possível conectar ao servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── login profissional com CRM ─────────────────────────────────────────────
  const handleLoginProfissional = async () => {
    if (!prCrm.trim() || !prSenha.trim()) {
      Alert.alert('Atenção', 'Preencha CRM e senha');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        crm:      prCrm.trim(),
        password: prSenha,
      });

      await signIn(data.user, data.token);

      navigation.reset({
        index: 0,
        routes: [{ name: 'ProfessionalDashboard', params: { user: data.user } }],
      });
    } catch (error: any) {
      Alert.alert(
        'Erro ao entrar',
        error.response?.data?.error === 'Credenciais inválidas'
          ? 'CRM ou senha incorretos'
          : 'Não foi possível conectar ao servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── cadastro paciente ──────────────────────────────────────────────────────
  const handleRegisterPaciente = async () => {
    if (!pName.trim() || !pEmail.trim() || !pSenha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    if (pSenha.length < 6) {
      Alert.alert('Atenção', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name:     pName.trim(),
        email:    pEmail.trim(),
        password: pSenha,
        role:     'user',
      });
      Alert.alert('Conta criada!', 'Faça login para continuar.', [
        { text: 'OK', onPress: () => { setEmail(pEmail.trim()); setTab('login'); } },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── cadastro profissional ──────────────────────────────────────────────────
  const handleRegisterProfissional = async () => {
    if (!prName.trim() || !prEmail.trim() || !prCrm.trim() || !prSenha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    if (prSenha.length < 6) {
      Alert.alert('Atenção', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register-professional', {
        name:     prName.trim(),
        email:    prEmail.trim(),
        password: prSenha,
        crm:      prCrm.trim(),
      });
      Alert.alert(
        'Cadastro enviado!',
        'Sua solicitação foi recebida. Aguarde aprovação do administrador.',
        [{ text: 'OK', onPress: () => { setTab('login'); setProfSubTab('entrar'); } }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <LinearGradient
      colors={
        isDark
          ? ['#0f172a', '#1e1040', '#0f172a']
          : ['#1e3a5f', '#2d1b69', '#1e3a5f']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Logo ── */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoCircle}>
              <Image source={imageLogo} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>SmartClínica</Text>
            <Text style={styles.appTagline}>Sistema de agendamentos médicos</Text>
          </View>

          {/* ── Tabs principais ── */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 4,
            marginBottom: 16,
          }}>
            {([
              { key: 'login',        label: 'Entrar',       icon: 'login' },
              { key: 'paciente',     label: 'Paciente',     icon: 'person-add' },
              { key: 'profissional', label: 'Profissional', icon: 'medical-services' },
            ] as { key: Tab; label: string; icon: any }[]).map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[{
                  flex: 1, alignItems: 'center', paddingVertical: 10,
                  borderRadius: 10, gap: 2,
                },
                tab === t.key && { backgroundColor: 'rgba(255,255,255,0.15)' },
                ]}
                onPress={() => setTab(t.key)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={t.icon}
                  size={18}
                  color={tab === t.key ? '#fff' : 'rgba(255,255,255,0.45)'}
                />
                <Text style={{
                  fontSize: 11, fontWeight: '700',
                  color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.45)',
                }}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ══════════════════════════════════════════
              ABA — Login (paciente / admin)
          ══════════════════════════════════════════ */}
          {tab === 'login' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Entrar na conta</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <View style={styles.inputRow}>
                  <MaterialIcons name="email" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={theme.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.inputRow}>
                  <MaterialIcons name="lock" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={theme.textMuted}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!showPass}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                    <MaterialIcons name={showPass ? 'visibility' : 'visibility-off'} size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.loginBtn, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="login" size={18} color="#fff" />
                    <Text style={styles.loginBtnText}>Entrar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ══════════════════════════════════════════
              ABA — Cadastro Paciente
          ══════════════════════════════════════════ */}
          {tab === 'paciente' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Criar conta de Paciente</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome completo</Text>
                <View style={styles.inputRow}>
                  <MaterialIcons name="person" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    placeholderTextColor={theme.textMuted}
                    value={pName}
                    onChangeText={setPName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <View style={styles.inputRow}>
                  <MaterialIcons name="email" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={theme.textMuted}
                    value={pEmail}
                    onChangeText={setPEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.inputRow}>
                  <MaterialIcons name="lock" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor={theme.textMuted}
                    value={pSenha}
                    onChangeText={setPSenha}
                    secureTextEntry={!showPPass}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPPass(v => !v)} style={styles.eyeBtn}>
                    <MaterialIcons name={showPPass ? 'visibility' : 'visibility-off'} size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.loginBtn, loading && { opacity: 0.6 }]}
                onPress={handleRegisterPaciente}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="person-add" size={18} color="#fff" />
                    <Text style={styles.loginBtnText}>Criar conta</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ══════════════════════════════════════════
              ABA — Profissional (Entrar / Cadastrar)
          ══════════════════════════════════════════ */}
          {tab === 'profissional' && (
            <View style={styles.card}>

              {/* ── sub-tabs ── */}
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                {(['entrar', 'cadastrar'] as ProfSubTab[]).map(st => (
                  <TouchableOpacity
                    key={st}
                    style={{
                      flex: 1, paddingVertical: 10, borderRadius: 10,
                      alignItems: 'center', borderWidth: 1,
                      borderColor: profSubTab === st ? theme.teal : theme.border,
                      backgroundColor: profSubTab === st ? theme.teal + '20' : 'transparent',
                    }}
                    onPress={() => setProfSubTab(st)}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      fontWeight: '700', fontSize: 13,
                      color: profSubTab === st ? theme.teal : theme.textMuted,
                    }}>
                      {st === 'entrar' ? 'Entrar' : 'Cadastrar'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ── sub-tab: Entrar com CRM ── */}
              {profSubTab === 'entrar' && (
                <>
                  <Text style={styles.cardTitle}>Acesso Profissional</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>CRM</Text>
                    <View style={styles.inputRow}>
                      <MaterialIcons name="badge" size={18} color={theme.textMuted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Ex: CRM/SP 123456"
                        placeholderTextColor={theme.textMuted}
                        value={prCrm}
                        onChangeText={setPrCrm}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Senha</Text>
                    <View style={styles.inputRow}>
                      <MaterialIcons name="lock" size={18} color={theme.textMuted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={theme.textMuted}
                        value={prSenha}
                        onChangeText={setPrSenha}
                        secureTextEntry={!showPrPass}
                        editable={!loading}
                        returnKeyType="done"
                        onSubmitEditing={handleLoginProfissional}
                      />
                      <TouchableOpacity onPress={() => setShowPrPass(v => !v)} style={styles.eyeBtn}>
                        <MaterialIcons name={showPrPass ? 'visibility' : 'visibility-off'} size={18} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.loginBtn, { backgroundColor: theme.teal }, loading && { opacity: 0.6 }]}
                    onPress={handleLoginProfissional}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <MaterialIcons name="login" size={18} color="#fff" />
                        <Text style={styles.loginBtnText}>Entrar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {/* ── sub-tab: Cadastrar ── */}
              {profSubTab === 'cadastrar' && (
                <>
                  <Text style={styles.cardTitle}>Cadastro de Profissional</Text>

                  {/* aviso */}
                  <View style={{
                    flexDirection: 'row', alignItems: 'flex-start',
                    backgroundColor: theme.blue + '15',
                    borderRadius: 10, padding: 12,
                    marginBottom: 16, gap: 10,
                    borderWidth: 1, borderColor: theme.blue + '30',
                  }}>
                    <MaterialIcons name="info-outline" size={18} color={theme.blue} style={{ marginTop: 1 }} />
                    <Text style={{ flex: 1, fontSize: 12, color: theme.blue, lineHeight: 18 }}>
                      Após o cadastro, aguarde aprovação do administrador para acessar o sistema.
                    </Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nome completo</Text>
                    <View style={styles.inputRow}>
                      <MaterialIcons name="person" size={18} color={theme.textMuted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Dr. Nome Sobrenome"
                        placeholderTextColor={theme.textMuted}
                        value={prName}
                        onChangeText={setPrName}
                        autoCapitalize="words"
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>E-mail</Text>
                    <View style={styles.inputRow}>
                      <MaterialIcons name="email" size={18} color={theme.textMuted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="dr@email.com"
                        placeholderTextColor={theme.textMuted}
                        value={prEmail}
                        onChangeText={setPrEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>CRM</Text>
                    <View style={styles.inputRow}>
                      <MaterialIcons name="badge" size={18} color={theme.textMuted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Ex: CRM/SP 123456"
                        placeholderTextColor={theme.textMuted}
                        value={prCrm}
                        onChangeText={setPrCrm}
                        autoCapitalize="characters"
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Senha</Text>
                    <View style={styles.inputRow}>
                      <MaterialIcons name="lock" size={18} color={theme.textMuted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor={theme.textMuted}
                        value={prSenha}
                        onChangeText={setPrSenha}
                        secureTextEntry={!showPrPass}
                        editable={!loading}
                      />
                      <TouchableOpacity onPress={() => setShowPrPass(v => !v)} style={styles.eyeBtn}>
                        <MaterialIcons name={showPrPass ? 'visibility' : 'visibility-off'} size={18} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.loginBtn, { backgroundColor: theme.teal }, loading && { opacity: 0.6 }]}
                    onPress={handleRegisterProfissional}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <MaterialIcons name="medical-services" size={18} color="#fff" />
                        <Text style={styles.loginBtnText}>Enviar cadastro</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          <Text style={styles.footerText}>SmartClínica v2.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}