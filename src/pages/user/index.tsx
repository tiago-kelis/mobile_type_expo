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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { createUser, emailExists } from '../../database/services/userServices';
import { RootStackParamList } from '../../routers/types';
import {styles} from "./styles"

type UserScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'User'>;

export default function User() {
  const navigation = useNavigation<UserScreenNavigationProp>();
  
  // Estados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados de visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de validação
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Validar email
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar campo individual
  function validateField(field: string, value: string) {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
        } else {
          newErrors.name = '';
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(value)) {
          newErrors.email = 'Email inválido';
        } else {
          newErrors.email = '';
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Senha é obrigatória';
        } else if (value.length < 6) {
          newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password = 'Senha deve conter pelo menos uma letra maiúscula';
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = 'Senha deve conter pelo menos um número';
        } else {
          newErrors.password = '';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirme sua senha';
        } else if (value !== password) {
          newErrors.confirmPassword = 'As senhas não coincidem';
        } else {
          newErrors.confirmPassword = '';
        }
        break;
    }

    setErrors(newErrors);
  }

  // Limpar formulário
  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }

  // Validar todo o formulário
  function validateForm(): boolean {
    let isValid = true;
    const newErrors = { ...errors };

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
      isValid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'As senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  // Cadastrar usuário
  async function handleRegister() {
    // Validar formulário
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      // Verificar se email já existe
      const exists = emailExists(email.toLowerCase().trim());
      if (exists) {
        Alert.alert('Erro', 'Este email já está cadastrado!');
        setLoading(false);
        return;
      }

      // Criar usuário
      const userId = createUser(
        name.trim(),
        email.toLowerCase().trim(),
        password
      );
      
      console.log('✅ Usuário criado com ID:', userId);
      
      Alert.alert(
        'Sucesso!', 
        `Conta criada com sucesso!\nBem-vindo, ${name}!`,
        [
          {
            text: 'Fazer Login',
            onPress: () => {
              clearForm();
              navigation.goBack();
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao criar a conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <MaterialIcons name="person-add" size={80} color="#007bff" />
        
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

        {/* Campo Nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo *</Text>
          <View style={[
            styles.inputWrapper,
            errors.name ? styles.inputError : null
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              value={name}
              onChangeText={(text) => {
                setName(text);
                validateField('name', text);
              }}
              onBlur={() => validateField('name', name)}
              editable={!loading}
            />
            <MaterialIcons name="person" size={20} color="#9e9e9e" />
          </View>
          {errors.name ? (
            <Text style={styles.errorText}>
              <MaterialIcons name="error" size={14} color="#dc3545" /> {errors.name}
            </Text>
          ) : null}
        </View>

        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <View style={[
            styles.inputWrapper,
            errors.email ? styles.inputError : null
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateField('email', text);
              }}
              onBlur={() => validateField('email', email)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            <MaterialIcons name="email" size={20} color="#9e9e9e" />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>
              <MaterialIcons name="error" size={14} color="#dc3545" /> {errors.email}
            </Text>
          ) : null}
        </View>

        {/* Campo Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha *</Text>
          <View style={[
            styles.inputWrapper,
            errors.password ? styles.inputError : null
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validateField('password', text);
              }}
              onBlur={() => validateField('password', password)}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color="#9e9e9e" 
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>
              <MaterialIcons name="error" size={14} color="#dc3545" /> {errors.password}
            </Text>
          ) : (
            <Text style={styles.hintText}>
              Mínimo 6 caracteres, 1 maiúscula e 1 número
            </Text>
          )}
        </View>

        {/* Campo Confirmar Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Senha *</Text>
          <View style={[
            styles.inputWrapper,
            errors.confirmPassword ? styles.inputError : null
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                validateField('confirmPassword', text);
              }}
              onBlur={() => validateField('confirmPassword', confirmPassword)}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons 
                name={showConfirmPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color="#9e9e9e" 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>
              <MaterialIcons name="error" size={14} color="#dc3545" /> {errors.confirmPassword}
            </Text>
          ) : null}
        </View>

        {/* Botão Criar Conta */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="check" size={24} color="#fff" />
              <Text style={styles.buttonText}>Criar Conta</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Botão Voltar */}
        <TouchableOpacity 
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.buttonText}>Voltar ao Login</Text>
        </TouchableOpacity>

        {/* Informações */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            * Campos obrigatórios
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

