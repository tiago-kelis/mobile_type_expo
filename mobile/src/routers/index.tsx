import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';

import Login              from '../pages/login';
import Dashboard          from '../pages/dashboard';
import AdminDashboard     from '../pages/adminDashboard';
import Home               from '../pages/home';
import User               from '../pages/user';
import Appointments       from '../pages/appointments';
import AdminServices      from '../pages/adminServices';
import AdminProfessionals from '../pages/adminProfessionals';
 import ProfessionalDashboard from '../pages/professionalDashboard';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const { theme, isDark } = useTheme();

  // ✅ Tema do NavigationContainer sincronizado com dark/light
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.bg,
      card:       theme.surface,
      text:       theme.textPrimary,
      border:     theme.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation:   'slide_from_right',
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ animation: 'fade' }}
        />

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            gestureEnabled: false,
            animation: 'slide_from_bottom',
          }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            gestureEnabled: false,
            animation: 'slide_from_bottom',
          }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ animation: 'slide_from_right' }}
        />

        <Stack.Screen
          name="Appointments"
          component={Appointments}
          options={{ animation: 'slide_from_right' }}
        />

        {/* ✅ NOVAS telas admin */}
        <Stack.Screen
          name="AdminServices"
          component={AdminServices}
          options={{ animation: 'slide_from_right' }}
        />

        <Stack.Screen
          name="AdminProfessionals"
          component={AdminProfessionals}
          options={{ animation: 'slide_from_right' }}
        />

        <Stack.Screen
          name="User"
          component={User}
          options={{ animation: 'slide_from_right' }}
        />       

        <Stack.Screen
          name="ProfessionalDashboard"
          component={ProfessionalDashboard}
          options={{
            gestureEnabled: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}