import React, { isValidElement, useEffect, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { checkAuth } from '@store/slices/authSlice';
import { navigateToHome } from '@services/navigationHandler';
import BackGroundLayout from '@components/BackGroundLayout';
import { forgotPasswordScreenStyles as styles } from './styles';
import { AppLogoIcon } from '@components/image';
import AppText from '@components/text/AppText';
import { Formik } from 'formik';
import schemaValidation from './hooks/schemaValidation';
import TextField from '@components/textInput/TextField';
import { Button } from '@components/Button';
import AuthTextField from '@components/textInput/AuthTextField';
import { useFocusRef } from '@hooks/useFocusRef';
import { theme } from '@themes/index';
import AppHeader from '@components/headers/AppHeader';
import { initialValues } from './hooks/initialValues';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

const ForgotPasswordScreen: React.FC = () => {
  const { inputRefs, setRef } = useFocusRef();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigateToHome();
      }
      //   else {
      //     navigateToAuth();
      //   }
    }
  }, [loading, isAuthenticated]);

  const handleError = (
    errors: string | undefined,
    touched: boolean | undefined,
  ): boolean | undefined => {
    return Boolean(errors) && Boolean(touched);
  };

  const renderHeader = useMemo(() => {
    return (
      <View style={styles.header}>
        <AppLogoIcon height={50} width={50} />
        <View style={styles.headerTextContainer}>
          <AppText
            text="Forgot Password"
            variant="title"
            style={styles.headerText}
          />
          <AppText text="Enter your email to reset your password" variant="deleted" />
        </View>
      </View>
    );
  }, []);

  const renderForm = useMemo(() => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={schemaValidation}
        onSubmit={(values: any) => {
          console.log('Login', values);
        }}
        validateOnMount={true}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <View style={styles.form}>
            <View>
              <AuthTextField
                innerRef={setRef('email')}
                value={values.email}
                onChange={handleChange('email') as () => void}
                onBlur={handleBlur('email') as () => void}
                isError={handleError(
                  errors.email as string,
                  touched.email as boolean,
                )}
                error={errors.email as string}
                placeholder={'Email'}
                keyboardType={'email-address'}
                leftComponent={
                  <FontAwesome6
                    name="envelope"
                    iconStyle="regular"
                    size={24}
                    style={{ marginRight: 8 }}
                    color={theme.colors.white}
                  />
                }
                styles={{ width: '100%' }}
                onSubmitEditing={() => handleSubmit()}
              />
            </View>

            <Button
              title="Forgot Password"
              onPress={handleSubmit}
              loading={loading}
              disabled={!isValid}
              //   style={styles.loginButton}
            />
          </View>
        )}
      </Formik>
    );
  }, []);

  return (
    <BackGroundLayout
      containerStyle={styles.container}
      edges={['top', 'bottom']}
    >
      <AppHeader title=" " goBack />
      <View style={styles.content}>
        {renderHeader}
        {renderForm}
      </View>
    </BackGroundLayout>
  );
};

export default ForgotPasswordScreen;
