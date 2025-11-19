import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar as telas
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import AdminDashboard from '../pages/adminDashboard'; // ✅ NOVA importação
import Home from '../pages/home';
import User from '../pages/user';

// Importar tipagem
import { RootStackParamList } from './types';
import Appointments from '../pages/appointments';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {/* Tela de Login - Tela inicial */}
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            animation: 'fade',
          }}
        />
        
        {/* Dashboard - Hub principal após login (usuário comum) */}
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
          options={{
            gestureEnabled: false,
            animation: 'slide_from_bottom',
          }}
        />
        
        {/* ✅ NOVA tela - AdminDashboard - Hub administrativo */}
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard}
          options={{
            gestureEnabled: false, // Impede voltar com gesto
            animation: 'slide_from_bottom',
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

         {/* ✅ NOVA ROTA: Appointments */}
        <Stack.Screen 
          name="Appointments" 
          component={Appointments}
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