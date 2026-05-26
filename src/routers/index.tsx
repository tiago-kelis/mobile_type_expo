import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import Login         from '../pages/login';
import Dashboard     from '../pages/dashboard';
import AdminDashboard from '../pages/adminDashboard';
import Home          from '../pages/home';
import User          from '../pages/user';
import Appointments  from '../pages/appointments';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          // ✅ CORRIGIDO: fundo consistente com o dark theme do app
          contentStyle: { backgroundColor: '#0f172a' },
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

        <Stack.Screen
          name="User"
          component={User}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}