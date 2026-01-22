import { createNavigationContainerRef } from '@react-navigation/native';
import type { AppStackParamList } from '../navigation/types';
import { AppRoutes } from '../navigation/routes';

export const navigationRef =
  createNavigationContainerRef<AppStackParamList>();

export const navigateToAuth = (): void => {
  navigationRef.reset({
    index: 0,
    routes: [{ name: AppRoutes.Auth }],
  });
};

export const navigateToHome = (): void => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: AppRoutes.Home }],
    });
  }
};

export const navigateToRestricted = (): void => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: AppRoutes.Auth }],
    });
  }
};
