import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routers/types';
import { makeStyles } from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import { registerApi } from '../../api/auth';

type UserScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'User'>;

interface FormErrors {
  name:            string;
  email:           string;
  password:        string;
  confirmPassword: string;
}

const EMPTY_ERRORS: FormErrors = {
  name: '', email: '', password: '', confirmPassword: '',
};

export default function User() {
  const navigation    = useNavigation<UserScreenNavigationProp>();
  const { theme }     = useTheme();
  const styles        = makeStyles(theme);

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]                 = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [errors, setErrors]                   = useState<FormErrors>(EMPTY_ERRORS);

  // ── validação ──────────────────────────────────────────────────────────────

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validateField = (field: keyof FormErrors, value: string) => {
    const next = { ...errors };

    switch (field) {
      case 'name':
        next.name = !value.trim()
          ? 'Nome é obrigatório'
          : value.trim().length < 3
          ? 'Mínimo 3 caracteres'
          : '';
        break;
      case 'email':
        next.email = !value.trim()
          ? 'E-mail é obrigatório'
          : !isValidEmail(value)
          ? 'E-mail inválido'
          : '';
        break;
      case 'password':
        next.password = !value
          ? 'Senha é obrigatória'
          : value.length < 6
          ? 'Mínimo 6 caracteres'
          : !/[A-Z]/.test(value)
          ? 'Precisa de pelo menos uma letra maiúscula'
          : !/[0-9]/.test(value)
          ? 'Precisa de pelo menos um número'
          : '';
        break;
      case 'confirmPassword':
        next.confirmPassword = !value
          ? 'Confirme sua senha'
          : value !== password
          ? 'As senhas não coincidem'
          : '';
        break;
    }

    setErrors(next);
  };

  const validateForm = (): boolean => {
    const next: FormErrors = { ...EMPTY_ERRORS };
    let valid = true;

    if (!name.trim()) {
      next.name = 'Nome é obrigatório'; valid = false;
    } else if (name.trim().length < 3) {
      next.name = 'Mínimo 3 caracteres'; valid = false;
    }

    if (!email.trim()) {
      next.email = 'E-mail é obrigatório'; valid = false;
    } else if (!isValidEmail(email)) {
      next.email = 'E-mail inválido'; valid = false;
    }

    if (!password) {
      next.password = 'Senha é obrigatória'; valid = false;
    } else if (password.length < 6) {
      next.password = 'Mínimo 6 caracteres'; valid = false;
    } else if (!/[A-Z]/.test(password)) {
      next.password = 'Precisa de pelo menos uma letra maiúscula'; valid = false;
    } else if (!/[0-9]/.test(password)) {
      next.password = 'Precisa de pelo menos um número'; valid = false;
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Confirme sua senha'; valid = false;
    } else if (confirmPassword !== password) {
      next.confirmPassword = 'As senhas não coincidem'; valid = false;
    }

    setErrors(next);
    return valid;
  };

  const clearForm = () => {
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setErrors(EMPTY_ERRORS);
  };

  // ── cadastro ───────────────────────────────────────────────────────────────

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // ✅ API MySQL — substitui createUser + emailExists SQLite
      await registerApi(
        name.trim(),
        email.toLowerCase().trim(),
        password
      );

      console.log('✅ Usuário criado via API');

      Alert.alert('Conta criada!', `Bem-vindo, ${name.trim()}!`, [
        {
          text: 'Fazer Login',
          onPress: () => { clearForm(); navigation.goBack(); },
        },
      ]);
    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error.message);
      // ✅ Trata erro de e-mail duplicado vindo da API
      Alert.alert(
        'Erro',
        error.message === 'Email já cadastrado'
          ? 'Este e-mail já está em uso'
          : error.message || 'Ocorreu um erro ao criar a conta'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── render helpers ─────────────────────────────────────────────────────────

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    field: keyof FormErrors,
    options: {
      placeholder: string;
      icon: keyof typeof MaterialIcons.glyphMap;
      secure?: boolean;
      toggleSecure?: () => void;
      showSecure?: boolean;
      keyboardType?: 'default' | 'email-address';
      autoCapitalize?: 'none' | 'words';
    }
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputRow, errors[field] ? styles.inputRowError : null]}>
        <MaterialIcons
          name={options.icon}
          size={18}
          color={theme.textMuted}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={options.placeholder}
          placeholderTextColor={theme.textMuted}
          value={value}
          onChangeText={(t) => { onChange(t); validateField(field, t); }}
          onBlur={() => validateField(field, value)}
          secureTextEntry={options.secure && !options.showSecure}
          keyboardType={options.keyboardType ?? 'default'}
          autoCapitalize={options.autoCapitalize ?? 'words'}
          autoCorrect={false}
          editable={!loading}
        />
        {options.toggleSecure && (
          <TouchableOpacity onPress={options.toggleSecure} style={styles.eyeBtn}>
            <MaterialIcons
              name={options.showSecure ? 'visibility' : 'visibility-off'}
              size={18}
              color={theme.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[field] ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={13} color={theme.red} />
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : field === 'password' ? (
        <Text style={styles.hintText}>Mínimo 6 caracteres, 1 maiúscula e 1 número</Text>
      ) : null}
    </View>
  );

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="person-add" size={36} color={theme.teal} />
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se na SmartClínica</Text>
        </View>

        {/* ── Formulário ── */}
        <View style={styles.card}>
          {renderInput('Nome Completo', name, setName, 'name', {
            placeholder: 'Seu nome completo',
            icon: 'person',
            autoCapitalize: 'words',
          })}

          {renderInput('E-mail', email, setEmail, 'email', {
            placeholder: 'seu@email.com',
            icon: 'email',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          })}

          {renderInput('Senha', password, setPassword, 'password', {
            placeholder: '••••••••',
            icon: 'lock',
            secure: true,
            showSecure: showPassword,
            toggleSecure: () => setShowPassword((v) => !v),
            autoCapitalize: 'none',
          })}

          {renderInput('Confirmar Senha', confirmPassword, setConfirmPassword, 'confirmPassword', {
            placeholder: '••••••••',
            icon: 'lock-outline',
            secure: true,
            showSecure: showConfirm,
            toggleSecure: () => setShowConfirm((v) => !v),
            autoCapitalize: 'none',
          })}

          <View style={styles.infoBox}>
            <MaterialIcons name="local-hospital" size={16} color={theme.teal} />
            <Text style={styles.infoText}>
              Ao criar sua conta você terá acesso ao sistema de agendamentos da clínica
            </Text>
          </View>
        </View>

        {/* ── Botões ── */}
        <TouchableOpacity
          style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialIcons name="check" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>Criar Conta</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
          disabled={loading}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back" size={18} color={theme.textSecondary} />
          <Text style={styles.secondaryBtnText}>Voltar ao Login</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}