import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth } from '../store/slices/authSlice';
import { theme } from '../themes/index';
import { navigateToAuth, navigateToHome } from '../services/navigationHandler';
import BackGroundLayout from '../components/BackGroundLayout';
import { AppLogoIcon } from '@components/image';

const LoadScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigateToHome();
      } else {
        navigateToAuth();
      }
    }
  }, [loading, isAuthenticated]);

  return (
    <BackGroundLayout containerStyle={styles.container}>
      <View style={styles.content}>
        <AppLogoIcon />
        <ActivityIndicator size="large" color={theme.colors.loaderColor} />
      </View>
    </BackGroundLayout>
  );
};

export default LoadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
});
