import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LeadListScreen } from '../screens/LeadListScreen';
import { ExpenseHomeScreen } from '../screens/ExpenseHomeScreen';
import { ExpenseScreen } from '../screens/ExpenseScreen';
import { Expense, UserIcon, UserGroupIcon } from '../components/icons';
import { theme } from '../themes/index';

export enum HomeRoutes {
  Profile = 'Profile',
  LeadList = 'LeadList',
  ExpenseHome = 'ExpenseHome',
}

export type HomeTabParamList = {
  [HomeRoutes.Profile]: undefined;
  [HomeRoutes.LeadList]: undefined;
  [HomeRoutes.ExpenseHome]: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

const androidTabBarStyles = {
  height: 60,
  paddingBottom: 10,
};

const HomeNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.loaderColor,
        tabBarInactiveTintColor: theme.text.colors.primary,
        tabBarStyle: {
          ...(Platform.OS === 'android' && androidTabBarStyles),
          position: 'absolute',
          borderTopWidth: 0,
        },
        tabBarBackground: () => {
          return (
            <BlurView
              blurAmount={7}
              blurRadius={10}
              blurType="dark"
              overlayColor="transparent"
              style={StyleSheet.absoluteFillObject}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.font12,
          fontWeight: '600',
        },
      }}
      initialRouteName={HomeRoutes.LeadList}>
      
      <Tab.Screen
        name={HomeRoutes.LeadList}
        component={LeadListScreen}
        options={{
          title: 'Leads',
          tabBarIcon: ({ size, color, focused }) => (
            <UserGroupIcon width={size || 24} height={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={HomeRoutes.ExpenseHome}
        component={ExpenseHomeScreen}
        options={{
          title: 'Expense',
          tabBarIcon: ({ size, color, focused }) => (
            <Expense height={24} width={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={HomeRoutes.Profile}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <UserIcon width={size || 24} height={size || 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;
