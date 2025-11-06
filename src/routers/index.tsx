import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar as telas
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import Home from '../pages/home';
import User from '../pages/user';

// Importar tipagem
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right', // Animação suave entre telas
          contentStyle: { backgroundColor: '#fff' }, // Fundo branco padrão
        }}
      >
        {/* Tela de Login - Tela inicial */}
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            animation: 'fade', // Login entra com fade
          }}
        />
        
        {/* Dashboard - Hub principal após login */}
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
          options={{
            gestureEnabled: false, // Impede voltar com gesto de swipe
            animation: 'slide_from_bottom', // Dashboard sobe de baixo
          }}
        />
        
        {/* Home - Informações detalhadas do usuário */}
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{
            animation: 'slide_from_right',
          }}
        />
        
        {/* User - Criar conta ou editar perfil */}
        <Stack.Screen 
          name="User" 
          component={User}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}