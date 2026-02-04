import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import AppNavigator from '@navigation/AppNavigator';
import {
  verifySupabaseConnection,
  getSupabaseConfigStatus,
} from '@services/supabase/verifyConnection';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '@services/navigationHandler';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Verify Supabase connection on app startup
    const checkSupabaseConnection = async () => {
      try {
        const configStatus = getSupabaseConfigStatus();

        if (!configStatus.urlConfigured || !configStatus.keyConfigured) {
          console.warn('⚠️ Supabase environment variables not configured');
          console.warn('Config status:', configStatus);
          return;
        }

        const isConnected = await verifySupabaseConnection();
        if (!isConnected) {
          console.error(
            '❌ Failed to verify Supabase connection. Please check your configuration.',
          );
        }
      } catch (error: any) {
        console.error(
          '❌ Error checking Supabase connection:',
          error?.message || error,
        );
      }
    };

    // Delay slightly to ensure environment variables are loaded
    setTimeout(() => {
      checkSupabaseConnection();
    }, 100);
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
