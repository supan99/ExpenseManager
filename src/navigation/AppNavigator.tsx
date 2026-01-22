import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from '../services/navigationHandler';
import { AppRoutes } from './routes';
import type { AppStackParamList } from './types';
import LoadScreen from '../screens/LoadScreen';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import { ExpenseScreen } from '../screens/ExpenseScreen';
import { ScanReceiptScreen } from '../screens/ScanReceiptScreen';
import { AnalyzingReceiptScreen } from '../screens/AnalyzingReceiptScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={AppRoutes.Loadscreen}
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name={AppRoutes.Loadscreen} component={LoadScreen} />
        <Stack.Screen name={AppRoutes.Auth} component={AuthNavigator} />
        <Stack.Screen name={AppRoutes.Home} component={HomeNavigator} />
        <Stack.Screen name={AppRoutes.Expense} component={ExpenseScreen} />
        <Stack.Screen name={AppRoutes.ScanReceipt} component={ScanReceiptScreen} />
        <Stack.Screen
          name={AppRoutes.AnalyzingReceipt}
          component={AnalyzingReceiptScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
