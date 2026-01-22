import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import BackGroundLayout from '../components/BackGroundLayout';
import { theme } from '../themes';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { HomeTabParamList } from '../navigation/HomeNavigator';
import { HomeRoutes } from '../navigation/HomeNavigator';
import { Camera, Expense } from '../components/icons';
import { AppRoutes } from '../navigation/routes';

type Props = BottomTabScreenProps<HomeTabParamList, HomeRoutes.ExpenseHome>;

export const ExpenseHomeScreen: React.FC<Props> = ({ navigation }) => {
  const renderSelectionScreen = (): React.JSX.Element => {
    return (
      <View style={styles.selectionContainer}>
        <Text style={styles.selectionTitle}>Add Expense</Text>
        <Text style={styles.selectionSubtitle}>
          Choose how you want to add your expense
        </Text>

        <View style={styles.selectionOptions}>
          <Pressable
            style={styles.selectionOption}
            onPress={() => {
              navigation.navigate(AppRoutes.Expense as never);
            }}>
            <View style={styles.selectionOptionIcon}>
              <Expense height={48} width={48} color={theme.colors.loaderColor} />
            </View>
            <Text style={styles.selectionOptionTitle}>Manual Entry</Text>
            <Text style={styles.selectionOptionDescription}>
              Enter expense details manually
            </Text>
          </Pressable>

          <Pressable
            style={styles.selectionOption}
            onPress={() => {
              navigation.navigate(AppRoutes.ScanReceipt as never);
            }}>
            <View style={styles.selectionOptionIcon}>
              <Camera height={48} width={48} color={theme.colors.loaderColor} />
            </View>
            <Text style={styles.selectionOptionTitle}>Upload Receipt</Text>
            <Text style={styles.selectionOptionDescription}>
              Scan receipt and auto-fill details
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <BackGroundLayout containerStyle={styles.container}>
      {renderSelectionScreen()}
    </BackGroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  selectionTitle: {
    fontSize: theme.fontSize.font32,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  selectionSubtitle: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  selectionOptions: {
    width: '100%',
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  selectionOption: {
    flex: 1,
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.l,
    padding: theme.spacing.l,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white20,
  },
  selectionOptionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.white20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  selectionOptionTitle: {
    fontSize: theme.fontSize.font18,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  selectionOptionDescription: {
    fontSize: theme.fontSize.font14,
    color: theme.text.colors.secondary,
    textAlign: 'center',
  },
  scrollContent: {
    padding: theme.spacing.l,
    paddingBottom: 100, // Space for bottom tab bar
  },
  content: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.l,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  backButtonText: {
    fontSize: theme.fontSize.font16,
    color: theme.colors.loaderColor,
    fontWeight: '600',
  },
  backButtonPlaceholder: {
    width: 60,
  },
  title: {
    fontSize: theme.fontSize.font32,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: theme.fontSize.font14,
    fontWeight: '600',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.m,
  },
  imageSection: {
    marginBottom: theme.spacing.m,
  },
  imageContainer: {
    marginTop: theme.spacing.xs,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.m,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: theme.spacing.m,
    backgroundColor: theme.colors.white10,
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeButtonText: {
    color: theme.text.colors.primary,
    fontSize: theme.fontSize.font24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  imageActionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  imageActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
  },
  imageActionButtonIcon: {
    fontSize: theme.fontSize.font20,
    marginRight: theme.spacing.xs,
  },
  imageActionButtonText: {
    fontSize: theme.fontSize.font14,
    color: theme.text.colors.primary,
    fontWeight: '600',
  },
  uploadOptionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    marginTop: theme.spacing.xs,
  },
  uploadOption: {
    flex: 1,
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.white20,
  },
  uploadOptionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.white20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  uploadOptionIconText: {
    fontSize: theme.fontSize.font32,
  },
  uploadOptionLabel: {
    fontSize: theme.fontSize.font16,
    fontWeight: '600',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  uploadOptionSubtext: {
    fontSize: theme.fontSize.font12,
    color: theme.text.colors.secondary,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: theme.spacing.m,
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    fontSize: theme.fontSize.font14,
    fontWeight: '600',
    color: theme.text.colors.primary,
  },
  progressPercentage: {
    fontSize: theme.fontSize.font14,
    fontWeight: 'bold',
    color: theme.colors.loaderColor,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.white20,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.loaderColor,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: theme.fontSize.font12,
    color: theme.text.colors.secondary,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.loaderColor,
  },
});
