import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../components/Button';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';
import { navigateToAuth } from '../services/navigationHandler';
import BackGroundLayout from '../components/BackGroundLayout';
import { theme } from '../themes';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList>,
  NativeStackScreenProps<AppStackParamList>
>;

export const ProfileScreen: React.FC<Props> = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logout()).unwrap();
          navigateToAuth();
        },
      },
    ]);
  };

  const InfoCard: React.FC<{
    icon: string;
    label: string;
    value: string;
  }> = ({ icon, label, value }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoCardIcon}>
        <Text style={styles.infoCardIconText}>{icon}</Text>
      </View>
      <View style={styles.infoCardContent}>
        <Text style={styles.infoCardLabel}>{label}</Text>
        <Text style={styles.infoCardValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <BackGroundLayout containerStyle={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={theme.colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarContainer}>
                {user?.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            {user?.title && (
              <Text style={styles.userTitle}>{user.title}</Text>
            )}

            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoGrid}>
            <InfoCard
              icon="👤"
              label="Full Name"
              value={user?.name || 'N/A'}
            />
            <InfoCard
              icon="✉️"
              label="Email"
              value={user?.email || 'N/A'}
            />
            {user?.phonenumber && (
              <InfoCard
                icon="📱"
                label="Phone"
                value={user.phonenumber}
              />
            )}
            {user?.title && (
              <InfoCard icon="💼" label="Title" value={user.title} />
            )}
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Leads</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Expenses</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonIcon}>⚙️</Text>
              <Text style={styles.actionButtonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonIcon}>ℹ️</Text>
              <Text style={styles.actionButtonText}>Help & Support</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Logout"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
      </ScrollView>
    </BackGroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for bottom tab bar
  },
  headerGradient: {
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
    borderBottomLeftRadius: theme.spacing.xl,
    borderBottomRightRadius: theme.spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.white20,
    padding: 4,
    marginBottom: theme.spacing.m,
  },
  avatarContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 66,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.white10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: theme.fontSize.font48,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
  },
  userName: {
    fontSize: theme.fontSize.font28,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  userTitle: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white20,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.fontSize.font12,
    color: theme.text.colors.primary,
    fontWeight: '600',
  },
  content: {
    padding: theme.spacing.l,
  },
  infoGrid: {
    marginBottom: theme.spacing.l,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  infoCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  infoCardIconText: {
    fontSize: theme.fontSize.font24,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: theme.fontSize.font12,
    color: theme.text.colors.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  infoCardValue: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.fontSize.font20,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.m,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSize.font28,
    fontWeight: 'bold',
    color: theme.colors.loaderColor,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.font12,
    color: theme.text.colors.secondary,
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: theme.spacing.l,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.sm,
  },
  actionButtonIcon: {
    fontSize: theme.fontSize.font24,
    marginRight: theme.spacing.m,
  },
  actionButtonText: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  logoutButton: {
    borderRadius: theme.spacing.m,
    marginTop: theme.spacing.sm,
  },
  logoutButtonText: {
    color: theme.text.colors.primary,
    fontWeight: '700',
  },
});
