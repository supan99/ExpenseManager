import { NavigatorScreenParams } from '@react-navigation/native';
import { AppRoutes } from './routes';
import { AuthStackParamList } from './AuthNavigator';
import { HomeTabParamList } from './HomeNavigator';

export type AppStackParamList = {
  [AppRoutes.Loadscreen]: undefined;
  [AppRoutes.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [AppRoutes.Home]: NavigatorScreenParams<HomeTabParamList>;
  [AppRoutes.Expense]: { receiptImage?: string; ocrResult?: any } | undefined;
  [AppRoutes.ScanReceipt]: undefined;
  [AppRoutes.AnalyzingReceipt]: { receiptImage: string };
};

export type RootStackParamList = AppStackParamList;
export type MainTabParamList = HomeTabParamList;
