import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { AppRoutes } from '../navigation/routes';
import { theme } from '../themes';
import { OCRService } from '../services/ocr';
import BackGroundLayout from '../components/BackGroundLayout';
import { showToast } from '../utils/toast';

type Props = NativeStackScreenProps<
  AppStackParamList,
  AppRoutes.AnalyzingReceipt
>;

export const AnalyzingReceiptScreen: React.FC<Props> = ({ navigation, route }) => {
  const { receiptImage } = route.params;
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (receiptImage) {
      processReceipt();
    }
  }, [receiptImage]);

  const processOCR = async (imageUri: string): Promise<void> => {
    if (!imageUri) {
      return;
    }

    const startTime = Date.now();
    const MINIMUM_DURATION = 5000;

    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          return prev;
        }
        return prev + 5;
      });
    }, 150);

    try {
      setProgress(20);
      const result = await OCRService.processImage(imageUri);
      console.log('result :>> ', JSON.stringify(result, null, 2));

      if (!result.success) {
        showToast({
          type: 'error',
          message: result.error || 'Failed to analyze receipt. Please try again.',
        });
        navigation.goBack();
        return;
      }
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_DURATION - elapsedTime);

      if (remainingTime > 0) {
        const waitInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) {
              return prev;
            }
            return prev + 1;
          });
        }, remainingTime / 10);

        await new Promise<void>((resolve) => setTimeout(() => resolve(), remainingTime));
        clearInterval(waitInterval);
      }

      clearInterval(progressInterval);
      setProgress(100);

      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));

      setIsProcessing(false);

      navigation.replace(AppRoutes.Expense, {
        receiptImage: imageUri,
        ocrResult: result,
      });
    } catch (error) {
      clearInterval(progressInterval);
      console.error('OCR Processing Error:', error);
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_DURATION - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise<void>((resolve) => setTimeout(() => resolve(), remainingTime));
      }
      
      setProgress(100);
      
      showToast({
        type: 'error',
        message: 'Failed to analyze receipt. Please try again.',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  };

  const processReceipt = async (): Promise<void> => {
    if (receiptImage) {
      await processOCR(receiptImage);
    }
  };

  const handleCancel = (): void => {
    navigation.goBack();
  };

  return (
    <BackGroundLayout containerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Pressable
          style={styles.cancelButton}
          onPress={handleCancel}
          accessibilityLabel="Cancel">
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {receiptImage ? (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: receiptImage }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
              <View style={styles.magnifyingGlass}>
                <View style={styles.magnifyingGlassLens} />
                <View style={styles.magnifyingGlassHandle} />
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <ActivityIndicator size="large" color={theme.colors.teal} />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.analyzingTitle}>Analyzing Receipt...</Text>
          <Text style={styles.analyzingDescription}>
            Our System is working its best to fetch your details from the receipt. This should only
            take a moment!
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </BackGroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.sm,
  },
  headerSpacer: {
    flex: 1,
  },
  cancelButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.font16,
    color: theme.colors.loaderColor,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xl,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  imageWrapper: {
    width: '100%',
    height: '60%',
    position: 'relative',
    backgroundColor: '#E3F2FD',
    borderRadius: theme.spacing.m,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
  },
  magnifyingGlass: {
    position: 'absolute',
    bottom: '20%',
    right: '15%',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  magnifyingGlassLens: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  magnifyingGlassHandle: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 20,
    height: 30,
    backgroundColor: '#000',
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  placeholderContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: theme.spacing.m,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  analyzingTitle: {
    fontSize: theme.fontSize.font28,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  analyzingDescription: {
    fontSize: theme.fontSize.font16,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.m,
  },
  progressContainer: {
    paddingBottom: theme.spacing.xl,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.white20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.loaderColor,
    borderRadius: 4,
  },
});
