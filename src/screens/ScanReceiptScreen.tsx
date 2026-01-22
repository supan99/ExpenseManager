import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
} from 'react-native-vision-camera';
import {
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  PhotoQuality,
} from 'react-native-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { AppRoutes } from '../navigation/routes';
import { theme } from '../themes';
import useCameraHooks from '../hooks/useCameraHooks';
import { Gallery } from '../components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AppStackParamList, AppRoutes.ScanReceipt>;

export const ScanReceiptScreen: React.FC<Props> = ({ navigation }) => {
  const [flashEnabled, setFlashEnabled] = useState<'off' | 'on'>('off');
  const [isActive, setIsActive] = useState(true);
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const { checkGalleryPermission } = useCameraHooks();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleClose = (): void => {
    navigation.goBack();
  };

  const handleHelp = (): void => {
    Alert.alert(
      'Help',
      'Position your receipt inside the frame and ensure the text is clear. Tap the capture button to take a photo.',
    );
  };

  const handleCapture = async (): Promise<void> => {
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos.',
      );
      return;
    }

    if (!camera.current) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    try {
      const photo: PhotoFile = await camera.current.takePhoto({
        flash: flashEnabled,
      });

      if (photo.path) {
        navigation.navigate(AppRoutes.AnalyzingReceipt, {
          receiptImage: `file://${photo.path}`,
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const handleGallery = async (): Promise<void> => {
    try {
      const hasPermission = await checkGalleryPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Gallery permission is required to select photos.',
        );
        return;
      }

      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.8 as PhotoQuality,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        handleImageResponse(response);
      });
    } catch (error) {
      console.error('Error launching gallery:', error);
      Alert.alert(
        'Error',
        'Failed to open gallery. Please check if photo permissions are granted.',
      );
    }
  };

  const handleImageResponse = (response: ImagePickerResponse): void => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      let errorMessage = 'Failed to access image';
      switch (response.errorCode) {
        case 'camera_unavailable':
          errorMessage = 'Camera is not available on this device';
          break;
        case 'permission':
          errorMessage =
            'Gallery permission denied. Please enable it in settings.';
          break;
        case 'others':
          errorMessage =
            response.errorMessage || 'An error occurred while accessing gallery';
          break;
      }
      Alert.alert('Error', errorMessage);
      return;
    }

    const imageUri = response.assets?.[0]?.uri;
    if (imageUri) {
      navigation.navigate(AppRoutes.AnalyzingReceipt, {
        receiptImage: imageUri,
      });
    } else {
      Alert.alert('Error', 'No image was selected');
    }
  };

  const toggleFlash = (): void => {
    setFlashEnabled(flashEnabled === 'off' ? 'on' : 'off');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={handleClose}
          accessibilityLabel="Close">
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Scan Receipt</Text>
        <Pressable
          style={styles.headerButton}
          onPress={handleHelp}
          accessibilityLabel="Help">
          <Text style={styles.helpIcon}>?</Text>
        </Pressable>
      </View>

      <View style={styles.cameraArea}>
        {!hasPermission ? (
          <View style={styles.permissionContainer}>
            <ActivityIndicator size="large" color={theme.colors.teal} />
            <Text style={styles.permissionText}>
              Requesting camera permission...
            </Text>
          </View>
        ) : !device ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>Camera not available</Text>
          </View>
        ) : (
          <>
            <Camera
              ref={camera}
              style={StyleSheet.absoluteFillObject}
              device={device}
              isActive={isActive}
              photo={true}
              torch={flashEnabled}
            />
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionText}>
                Position receipt inside the frame.
              </Text>
              <Text style={styles.instructionText}>Ensure text is clear.</Text>
            </View>

            <View style={styles.frameContainer}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          </>
        )}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={toggleFlash}
          accessibilityLabel="Toggle flash"
          disabled={!hasPermission}>
          <Text
            style={[
              styles.flashIcon,
              flashEnabled === 'on' && styles.flashIconActive,
            ]}>
            ⚡
          </Text>
          <Text style={styles.bottomButtonText}>Flash</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.captureButton,
            (!hasPermission || !device) && styles.captureButtonDisabled,
          ]}
          onPress={handleCapture}
          accessibilityLabel="Capture photo"
          disabled={!hasPermission || !device}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleGallery}
          accessibilityLabel="Open gallery">
          <Gallery height={24} width={24} color={theme.text.colors.primary} />
          <Text style={styles.bottomButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.l,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.l,
    paddingBottom: theme.spacing.m,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: theme.fontSize.font24,
    color: theme.text.colors.primary,
    fontWeight: 'bold',
  },
  helpIcon: {
    fontSize: theme.fontSize.font24,
    color: theme.text.colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: theme.fontSize.font20,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
  },
  cameraArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: theme.colors.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.primary,
    marginTop: theme.spacing.m,
  },
  instructionsContainer: {
    position: 'absolute',
    top: theme.spacing.s,
    alignItems: 'center',
    zIndex: 5,
  },
  instructionText: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  frameContainer: {
    width: '80%',
    aspectRatio: 0.65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.text.colors.primary,
    borderRadius: theme.spacing.m,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: theme.colors.teal,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: theme.spacing.m,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: theme.spacing.m,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.spacing.m,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: theme.spacing.m,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.l,
    backgroundColor: theme.colors.grey,
    borderTopWidth: 1,
    borderTopColor: theme.colors.white20,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flashIcon: {
    fontSize: theme.fontSize.font24,
    marginBottom: theme.spacing.xs,
    opacity: 0.5,
  },
  flashIconActive: {
    opacity: 1,
  },
  bottomButtonText: {
    fontSize: theme.fontSize.font12,
    color: theme.text.colors.primary,
    marginTop: theme.spacing.xs,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: theme.colors.teal,
    backgroundColor: theme.colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.xl,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.teal,
    borderWidth: 2,
    borderColor: theme.text.colors.primary,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
});
