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
import { styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { validateLogin } from '../../database/services/userServices';
import { RootStackParamList } from '../../routers/types';
import { LinearGradient } from 'expo-linear-gradient';

const imageLogo = require('../../../assets/login.png');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail]     = useState('');
  const [senha, setSenha]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ── login ──────────────────────────────────────────────────────────────────

  // ✅ CORRIGIDO: loading sempre encerrado via finally
  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    try {
      const user = validateLogin(email.trim(), senha);

      if (user) {
        console.log('✅ Login realizado:', user.email, '| role:', user.role);
        if (user.role === 'admin') {
          navigation.navigate('AdminDashboard', { user });
        } else {
          navigation.navigate('Dashboard', { user });
        }
      } else {
        Alert.alert('Erro', 'E-mail ou senha incorretos');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    } finally {
      // ✅ CORRIGIDO: sempre executado
      setLoading(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1040', '#0f172a']}
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
              <Image
                source={imageLogo}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>SmartBarber</Text>
            <Text style={styles.appTagline}>Gerencie seus agendamentos</Text>
          </View>

          {/* ── Card do formulário ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar na conta</Text>

            {/* E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <View style={styles.inputRow}>
                <MaterialIcons name="email" size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#475569"
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

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputRow}>
                <MaterialIcons name="lock" size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#475569"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showPass}
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPass((v) => !v)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={showPass ? 'visibility' : 'visibility-off'}
                    size={18}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão entrar */}
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

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Criar conta */}
            {/* ✅ CORRIGIDO: navigate sem params — User cria novo usuário */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('User')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="person-add" size={18} color="#3b82f6" />
              <Text style={styles.registerBtnText}>Criar nova conta</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}