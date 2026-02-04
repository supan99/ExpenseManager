import { AppLogoIcon, BackButtonIcon } from '@components/image';
import AppText from '@components/text/AppText';
import { theme } from '@themes/index';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@context/navigation';


type Props = {
  goBack?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  centralComponent?: React.ReactNode;
  title?: string;
  favorites?: boolean;
  notifications?: boolean;
  addButton?: boolean;
  onSkip?: () => void;
  style?: StyleProp<ViewStyle>;
};

const AppHeader: React.FC<Props> = ({
  goBack = false,
  leftComponent,
  rightComponent,
  centralComponent,
  title,
  favorites = false,
  notifications = false,
  addButton = false,
  onSkip,
  style,
}) => {
  const dispatch = useDispatch();
  const addButtonRef = useRef<View>(null);
  const navigation = useNavigation();


  const handleGoBack = useCallback(() => {
    if (goBack) {
      navigation.goBack();
    }
  }, [navigation]);

//   const handleGoToFavorites = useCallback(() => {
//     navigation.navigate(AppRoutes.Favorites, {
//       screen: FavoritesRoutes.Favorites,
//     });
//   }, [navigation]);

//   const handleGoToNotifications = useCallback(() => {
//     navigation.navigate(AppRoutes.Notifications);
//   }, [navigation]);

//   const handleCloseTooltip = useCallback(() => {
//     hideTooltipModal();
//   }, [hideTooltipModal]);

//   const handlePressOption = useCallback(
//     (option: TooltipOption) => {
//       hideTooltipModal();
//       if (option.onPress) {
//         option.onPress();
//       }
//     },
//     [hideTooltipModal],
//   );

//   const handleNewChat = useCallback(() => {
//     navigation.navigate(AppRoutes.Chat, {
//       screen: ChatRoutes.NewChat,
//       params: {
//         profileType: ChatType.Private,
//       },
//     });
//   }, [navigation]);

//   const tooltipOptions: TooltipOption[] = useMemo(
//     () => [
//       {
//         type: 'createEvent',
//         label: 'Create Event',
//         icon: (
//           <CalendarPlus width={20} height={20} color={theme.colors.white} />
//         ),
//         onPress: handleCreateEvent,
//       },
//       {
//         type: 'newChat',
//         label: 'New Chat',
//         icon: <Message width={20} height={20} color={theme.colors.white} />,
//         onPress: handleNewChat,
//       },
//     ],
//     [handleCreateEvent, handleNewChat],
//   );

//   const handleAddButtonPress = useCallback(() => {
//     if (tooltipOptions.length > 0) {
//       addButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
//         const screenWidth = Dimensions.get('window').width;
//         const tooltipWidth = 200;
//         const rightPadding = 16;
//         const gapBelowButton = 4;

//         const calculatedLeft = screenWidth - tooltipWidth - rightPadding;
//         const calculatedTop = pageY + height + gapBelowButton;

//         const position = {
//           top: calculatedTop,
//           left: calculatedLeft,
//         };

//         showTooltip({
//           options: tooltipOptions,
//           position,
//           onClose: handleCloseTooltip,
//           onPressOption: handlePressOption,
//         });
//       });
//     }
//   }, [tooltipOptions, showTooltip, handleCloseTooltip, handlePressOption]);

  useEffect(() => {
    // refetchNotifications();
    // dispatch(setNotifications(notificationData?.data || []));
    // dispatch(setUnreadCount(notificationData?.unseenCount || 0));
  }, []);

  return (
    <>
      <View style={[styles.container, style]}>
        {goBack && !leftComponent && (
          <Pressable onPress={handleGoBack} style={styles.leftComponent}>
            <BackButtonIcon width={24} height={24} color={theme.colors.white} />
          </Pressable>
        )}
        {/* {favorites && (
          <Pressable onPress={handleGoToFavorites} style={styles.leftComponent}>
            <Star color="#fff" height={24} width={24} />
          </Pressable>
        )} */}
        {leftComponent && (
          <View style={styles.leftComponent}>{leftComponent}</View>
        )}
        {!leftComponent && !favorites && !goBack && (
          <View style={styles.leftComponent} />
        )}
        {title && <AppText style={styles.text} text={title} />}
        <View style={styles.centered}>{centralComponent}</View>
        {!title && !centralComponent && (
          <View style={styles.centered}>
            <AppLogoIcon height={44} width={120} />
          </View>
        )}
        <View style={{ zIndex: 10, flexDirection: 'row' }}>
          {/* {notifications && (
            <View style={styles.rightComponent}>
              <NotificationBell
                handleGoToNotifications={handleGoToNotifications}
                notificationCount={unreadCount}
              />
            </View>
          )} */}
          {/* {onSkip && (
            <Pressable style={styles.rightComponent} onPress={onSkip}>
              <View style={styles.skipButton}>
                <PText text={'Skip'} style={styles.skipButtonText} />
              </View>
            </Pressable>
          )} */}
          {/* {addButton && profile.profileType === ProfileType.Guest && (
            <View ref={addButtonRef} collapsable={false}>
              <Pressable
                style={[styles.rightComponent, { marginLeft: theme.spacing.s }]}
                onPress={handleAddButtonPress}
              >
                <AddEvent width={40} height={40} color="#fff" />
              </Pressable>
            </View>
          )} */}
          {rightComponent && (
            <View style={styles.rightComponent}>{rightComponent}</View>
          )}
          {!rightComponent && !notifications && (
            <View style={styles.rightComponent} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backText: {
    color: theme.colors.white,
    fontWeight: '600',
    lineHeight: 24,
  },
  centered: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 50 : 44,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? 14 : 0,
    marginBottom: 8,
  },
  leftComponent: {
    alignItems: 'center',
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 60 : 44,
    width: 50,
    zIndex: 10,
  },
  rightComponent: {
    alignItems: 'center',
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 60 : 44,
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  skipButton: {
    backgroundColor: theme.colors.white20,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
  skipButtonText: {
    color: theme.colors.blue,
  },
  text: {
    color: theme.colors.white,
    position: 'absolute',
    width: '100%',
    fontSize: theme.fontSize.font20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AppHeader;
