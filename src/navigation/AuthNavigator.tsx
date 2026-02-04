import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen,
  LoginScreen,
  ForgotPasswordScreen,
  SignUpScreen,
} from '@screens/index';
import { AuthRoutes } from './routes';

export type AuthStackParamList = {
  [AuthRoutes.Welcome]: undefined;
  [AuthRoutes.Login]: undefined;
  [AuthRoutes.SignUp]: undefined;
  [AuthRoutes.ForgotPassword]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthRoutes.Welcome}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={AuthRoutes.Welcome} component={WelcomeScreen} />
      <Stack.Screen name={AuthRoutes.Login} component={LoginScreen} />
      <Stack.Screen name={AuthRoutes.SignUp} component={SignUpScreen} />
      <Stack.Screen
        name={AuthRoutes.ForgotPassword}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
