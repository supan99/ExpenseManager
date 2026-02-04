import React, { createContext, useContext, useRef } from 'react';
import {
  NavigationContainerRef,
  NavigationProp,
  useNavigation as useBaseNavigation,
} from '@react-navigation/native';
import { AppStackParamList } from '@navigation/types';

const NavigationContext = createContext<React.RefObject<
  NavigationContainerRef<AppStackParamList>
> | null>(null);

export type NavigationProviderProps = {
  children: React.ReactNode;
};

export const useNavigation = () =>
  useBaseNavigation<NavigationProp<AppStackParamList>>();

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const navigationRef = useRef<NavigationContainerRef<AppStackParamList> | null>(null);

  return (
    <NavigationContext.Provider value={navigationRef as React.RefObject<NavigationContainerRef<AppStackParamList>> | null}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationRef = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      'useNavigationRef must be used within a NavigationProvider',
    );
  }
  return context;
};
