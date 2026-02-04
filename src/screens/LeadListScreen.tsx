import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Input } from '../components/textInput/TextField';
import { Lead } from '../types';
import {leadApi} from '../api/auth';
import { theme } from '../themes';
import BackGroundLayout from '../components/BackGroundLayout';

export const LeadListScreen: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadLeads = useCallback(
    async (page: number = 1, search: string = '') => {
      try {
        setLoading(true);
        const response = await leadApi.getLeads(
          page,
          50,
          'lead_source_id',
          'desc',
          search || undefined,
        );
        console.log('loadLeads response :>> ', JSON.stringify(response, null, 2));
        if (page === 1) {
          setLeads(response?.data || []);
        } else {
          setLeads((prev) => [...prev, ...(response?.data || [])]);
        }
        setCurrentPage(response?.current_page || 1);
        setLastPage(response?.last_page || 1);
        setTotal(response?.total || 0);
      } catch (error) {
        console.error('Error loading leads:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadLeads(1, searchQuery);
  }, [searchQuery]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    loadLeads(1, searchQuery);
  }, [loadLeads, searchQuery]);

  const handleLoadMore = useCallback(() => {
    if (!loading && currentPage < lastPage) {
      loadLeads(currentPage + 1, searchQuery);
    }
  }, [loading, currentPage, lastPage, loadLeads, searchQuery]);

  const getInitials = (name: string): string => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      theme.colors.loaderColor,
      theme.colors.blue,
      theme.colors.success,
      theme.colors.coral,
      theme.colors.teal,
      theme.colors.yellow,
      theme.colors.mint,
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderLeadItem = useCallback(
    ({ item }: { item: Lead }) => {
      const initials = getInitials(item.name);
      const avatarColor = getAvatarColor(item.name);

      return (
        <View style={styles.leadItem}>
          <View style={styles.leadContent}>
            <View style={styles.avatarContainer}>
              {item.avatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[styles.avatarPlaceholder, { backgroundColor: avatarColor }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
            </View>

            <View style={styles.leadInfo}>
              <Text style={styles.leadName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>✉️</Text>
                  <Text style={styles.leadEmail} numberOfLines={1}>
                    {item.email}
                  </Text>
                </View>
              )}
              {item.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📱</Text>
                  <Text style={styles.leadPhone} numberOfLines={1}>
                    {item.phone}
                  </Text>
                </View>
              )}
              {item.company && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🏢</Text>
                  <Text style={styles.leadCompany} numberOfLines={1}>
                    {item.company}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    },
    [],
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.blue} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No leads found</Text>
    </View>
  );

  return (
    <BackGroundLayout containerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <Text style={styles.subtitle}>
          {total > 0 ? `${total} total leads` : ''}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={leads}
        renderItem={renderLeadItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </BackGroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: theme.spacing.m,
  },
  title: {
    fontSize: theme.fontSize.font32,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.font14,
    color: theme.text.colors.secondary,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.s,
    paddingBottom: theme.spacing.m,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    padding: theme.spacing.s,
    paddingTop: 0,
    paddingBottom: 60,
  },
  leadItem: {
    backgroundColor: theme.colors.white10,
    borderRadius: theme.spacing.m,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.white20,
  },
  leadContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: theme.spacing.m,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.white20,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.loaderColor,
  },
  avatarText: {
    fontSize: theme.fontSize.font20,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: theme.fontSize.font18,
    fontWeight: '600',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  infoIcon: {
    fontSize: theme.fontSize.font14,
    marginRight: theme.spacing.xs,
  },
  leadEmail: {
    fontSize: theme.fontSize.font14,
    color: theme.text.colors.secondary,
    flex: 1,
  },
  leadPhone: {
    fontSize: theme.fontSize.font14,
    color: theme.text.colors.secondary,
    flex: 1,
  },
  leadCompany: {
    fontSize: theme.fontSize.font14,
    color: theme.text.colors.secondary,
    flex: 1,
    fontStyle: 'italic',
  },
  footerLoader: {
    paddingVertical: theme.spacing.l,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.secondary,
  },
});
