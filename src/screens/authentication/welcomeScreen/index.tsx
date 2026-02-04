import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { checkAuth } from '@store/slices/authSlice';
import { navigateToHome } from '@services/navigationHandler';
import BackGroundLayout from '@components/BackGroundLayout';
import { welcomeScreenStyles as styles } from './styles';
import { AppLogoIcon } from '@components/image';
import AppText from '@components/text/AppText';
import { Formik, FormikProps } from 'formik';
import { initialValues, LoginFormValues } from './hooks/initialValues';
import { loginValidationSchema } from './hooks/loginValidationSchema';
import { Button } from '@components/Button';
import AuthTextField from '@components/textInput/AuthTextField';
import { useFocusRef } from '@hooks/useFocusRef';
import { AuthRoutes } from '@navigation/routes';
import { useNavigation } from '@context/navigation';
import { AppRoutes } from '@navigation/routes';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { theme } from '@themes/index';

const welcomeScreen: React.FC = () => {
    const { inputRefs, setRef } = useFocusRef();
    const formikRef = useRef<FormikProps<LoginFormValues> | null>(null);
    const navigation = useNavigation();
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
            <AppLogoIcon height={100} width={100} />
            <View style={styles.headerTextContainer}>
              <AppText
                text="Welcome to CoinUp"
                variant="title"
                style={styles.headerText}
              />
              <AppText text="Login to manage your expenses" variant="deleted" />
            </View>
          </View>
        );
    }, [])


    const renderForm = useMemo(() => {
        return (
          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            ref={formikRef}
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
              setFieldValue,
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
                        style={{ marginRight: 4 }}
                        color={theme.colors.white}
                      />
                    }
                    styles={{ width: '100%' }}
                    onSubmitEditing={() => inputRefs['password']?.focus()}
                  />

                  <AuthTextField
                    innerRef={setRef('password')}
                    placeholder={'Password'}
                    value={values.password}
                    onChange={handleChange('password') as () => void}
                    onBlur={handleBlur('password') as () => void}
                    isVisible={true}
                    error={errors.password as string}
                    isError={handleError(
                      errors.password as string,
                      touched.password as boolean,
                    )}
                    keyboardType={'default'}
                    styles={{ width: '100%' }}
                    leftComponent={
                      <FontAwesome6
                        name="shield-halved"
                        iconStyle="solid"
                        size={24}
                        style={{ marginRight: 4 }}
                        color={theme.colors.white}
                      />
                    }
                    rightComponent={
                      <Pressable
                        onPress={() =>
                          setFieldValue('isVisible', !values.isVisible)
                        }
                      >
                        <FontAwesome6
                          name={values.isVisible ? 'eye' : 'eye-slash'}
                          iconStyle="solid"
                          size={24}
                          style={{ marginLeft: 4 }}
                          color={theme.colors.white}
                        />
                      </Pressable>
                    }
                  />

                  <Pressable
                    style={styles.forgotPassword}
                    onPress={() => {
                      navigation.navigate(AppRoutes.Auth, {
                        screen: AuthRoutes.ForgotPassword,
                      });
                    }}
                  >
                    <AppText
                      text="Forgot Password?"
                      style={styles.forgotPasswordText}
                    />
                  </Pressable>
                </View>

                <View>
                  <Button
                    title="Login"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!isValid}
                    //   style={styles.loginButton}
                  />
                  <View style={styles.dontHaveAccountContainer}>
                    <AppText
                      text="Don't have an account?"
                      style={styles.dontHaveAccountText}
                    />
                    <Pressable
                      onPress={() => {
                        navigation.navigate(AppRoutes.Auth, {
                          screen: AuthRoutes.SignUp,
                        });
                      }}
                    >
                      <AppText text="Sign Up" style={styles.signUpText} />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        );
    }, []);

  return (
    <BackGroundLayout containerStyle={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {renderHeader}
        {renderForm}
      </View>
    </BackGroundLayout>
  );
};

export default welcomeScreen;
