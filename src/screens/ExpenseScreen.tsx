import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import BackGroundLayout from '../components/BackGroundLayout';
import { theme } from '../themes';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { AppRoutes } from '../navigation/routes';
import { BackButtonIcon } from '../components/image';
import { showToast } from '../utils/toast';

type Props = NativeStackScreenProps<AppStackParamList, AppRoutes.Expense>;

interface ExpenseFormValues {
  title: string;
  amount: string;
  date: string;
  category: string;
  receiptImage: string | null;
  notes: string;
}

const expenseValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .trim()
    .min(2, 'Title must be at least 2 characters'),
  amount: Yup.string()
    .required('Amount is required'),
  date: Yup.string()
    .required('Date is required'),
  category: Yup.string().trim(),
  notes: Yup.string().trim(),
});

export const ExpenseScreen: React.FC<Props> = ({ navigation, route }) => {

  const receiptImageFromRoute = route.params?.receiptImage;
  const ocrResultFromRoute = route.params?.ocrResult;

  useEffect(() => {
    if (ocrResultFromRoute && ocrResultFromRoute.success) {
      getInitialValues();
    }
  }, [ocrResultFromRoute]);

  const getInitialValues = (): ExpenseFormValues => {
    const baseValues: ExpenseFormValues = {
      title: '',
      amount: '',
      date: '',
      category: '',
      receiptImage: receiptImageFromRoute || null,
      notes: '',
    };

    if (route.params?.ocrResult) {
      return {
        ...baseValues,
        amount: ocrResultFromRoute.amount || '',
        date: ocrResultFromRoute.date || '',
        title: ocrResultFromRoute.merchant || '',
        category: ocrResultFromRoute.category || '',
      };
    }

    return baseValues;
  };

  const initialValues = getInitialValues();

  const handleSubmit = (values: ExpenseFormValues): void => {
    showToast({
      type: 'success',
      message: 'Expense saved successfully!',
    });

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: AppRoutes.Home }],
      });
    }, 1000);
  };

  return (
    <BackGroundLayout containerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: AppRoutes.Home }],
          })}
          accessibilityLabel="Go back">
          <BackButtonIcon width={24} height={24} color={theme.colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={expenseValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit: formikSubmit,
          setFieldValue,
          isValid,
        }) => {
          React.useEffect(() => {
            if (
              receiptImageFromRoute &&
              !ocrResultFromRoute &&
              values.receiptImage === receiptImageFromRoute
            ) {
            } else if (ocrResultFromRoute && ocrResultFromRoute.success) {
              if (ocrResultFromRoute.amount) {
                setFieldValue('amount', ocrResultFromRoute.amount);
              }
              if (ocrResultFromRoute.date) {
                setFieldValue('date', ocrResultFromRoute.date);
              }
              if (ocrResultFromRoute.merchant) {
                setFieldValue('title', ocrResultFromRoute.merchant);
              }
              if (ocrResultFromRoute.category) {
                setFieldValue('category', ocrResultFromRoute.category);
              }
            }
          }, [
            receiptImageFromRoute,
            ocrResultFromRoute,
            values.receiptImage,
          ]);

          return (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Input
                label="Title *"
                placeholder="Enter expense title"
                value={values.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                error={touched.title && errors.title ? errors.title : undefined}
              />

              <Input
                label="Amount *"
                placeholder="0.00"
                value={values.amount}
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                keyboardType="decimal-pad"
                error={
                  touched.amount && errors.amount ? errors.amount : undefined
                }
              />

              <Input
                label="Date *"
                placeholder="YYYY-MM-DD"
                value={values.date}
                onChangeText={handleChange('date')}
                onBlur={handleBlur('date')}
                error={touched.date && errors.date ? errors.date : undefined}
              />

              <Input
                label="Category"
                placeholder="Enter category"
                value={values.category}
                onChangeText={handleChange('category')}
                onBlur={handleBlur('category')}
                error={
                  touched.category && errors.category
                    ? errors.category
                    : undefined
                }
              />

              <View style={styles.imageSection}>
                <Text style={styles.sectionLabel}>Receipt Image</Text>
                {values.receiptImage ? (
                  <View style={styles.imageContainer}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: values.receiptImage }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                ) : null
              }</View>

              <Input
                label="Notes"
                placeholder="Additional notes"
                value={values.notes}
                onChangeText={handleChange('notes')}
                onBlur={handleBlur('notes')}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                error={
                  touched.notes && errors.notes ? errors.notes : undefined
                }
              />

              <Button
                title="Save Expense"
                onPress={formikSubmit}
                style={styles.submitButton}
                disabled={!isValid}
              />
            </View>
          </ScrollView>
          );
        }}
      </Formik>
    </BackGroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.sm,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: theme.fontSize.font24,
    color: theme.text.colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: theme.fontSize.font20,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: theme.spacing.l,
    paddingTop: theme.spacing.sm,
    paddingBottom: 100,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: theme.fontSize.font32,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.l,
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
