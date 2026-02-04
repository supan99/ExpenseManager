import { createNavigationContainerRef } from '@react-navigation/native';
import type { AppStackParamList } from '@navigation/types';
import { AppRoutes, AuthRoutes } from '@navigation/routes';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

export const navigateToAuth = (
  screenName: AuthRoutes = AuthRoutes.Welcome,
): void => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: AppRoutes.Auth,
          params: {
            screen: screenName,
          },
        },
      ],
    });
  }
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