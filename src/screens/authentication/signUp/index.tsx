import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { checkAuth } from '@store/slices/authSlice';
import { navigateToHome } from '@services/navigationHandler';
import BackGroundLayout from '@components/BackGroundLayout';
import { signUpScreenStyles as styles } from './styles';
import { AppLogoIcon } from '@components/image';
import AppText from '@components/text/AppText';
import { Formik, FormikProps } from 'formik';
import { initialValues, SignUpFormValues } from './hooks/initialValues';
import schemaValidation from './hooks/schemaValidation';
import { Button } from '@components/Button';
import AuthTextField from '@components/textInput/AuthTextField';
import { useFocusRef } from '@hooks/useFocusRef';
import { AuthRoutes } from '@navigation/routes';
import { useNavigation } from '@context/navigation';
import { AppRoutes } from '@navigation/routes';
import AppHeader from '@components/headers/AppHeader';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { theme } from '@themes/index';

const SignUpScreen: React.FC = () => {
  const { inputRefs, setRef } = useFocusRef();
  const formikRef = useRef<FormikProps<SignUpFormValues> | null>(null);
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
            text="Create an account"
            variant="title"
            style={styles.headerText}
          />
          <AppText text="Create an account to manage your expenses" variant="deleted" />
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
          console.log('Sign Up', values);
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
              styles={{ width: '100%' }}
              onSubmitEditing={() => inputRefs['firstname']?.focus()}
              leftComponent={
                <FontAwesome6
                  name="envelope"
                  iconStyle="regular"
                  size={24}
                  style={{ marginRight: 4 }}
                  color={theme.colors.white}
                />
              }
            />

            <AuthTextField
              innerRef={setRef('firstname')}
              value={values.firstname}
              onChange={handleChange('firstname') as () => void}
              onBlur={handleBlur('firstname') as () => void}
              isError={handleError(
                errors.firstname as string,
                touched.firstname as boolean,
              )}
              error={errors.firstname as string}
              placeholder={'First Name'}
              keyboardType={'default'}
              styles={{ width: '100%' }}
              onSubmitEditing={() => inputRefs['lastname']?.focus()}
              leftComponent={
                <FontAwesome6
                  name="user"
                  iconStyle="regular"
                  size={24}
                  style={{ marginRight: 4 }}
                  color={theme.colors.white}
                />
              }
            />

            <AuthTextField
              innerRef={setRef('lastname')}
              value={values.lastname}
              onChange={handleChange('lastname') as () => void}
              onBlur={handleBlur('lastname') as () => void}
              isError={handleError(
                errors.lastname as string,
                touched.lastname as boolean,
              )}
              error={errors.lastname as string}
              placeholder={'Last Name'}
              keyboardType={'default'}
              styles={{ width: '100%' }}
              onSubmitEditing={() => inputRefs['password']?.focus()}
              leftComponent={
                <FontAwesome6
                  name="user"
                  iconStyle="regular"
                  size={24}
                  style={{ marginRight: 4 }}
                  color={theme.colors.white}
                />
              }
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
                <Pressable onPress={() => setFieldValue('isVisible', !values.isVisible)}>
                  <FontAwesome6
                    name={values.isVisible ? 'eye' : 'eye-slash'}
                    iconStyle="solid"
                    size={24}
                    style={{ marginLeft: 4 }}
                    color={theme.colors.white}
                  />
                </Pressable>
              }
              onSubmitEditing={() => inputRefs['confirmPassword']?.focus()}
            />

            <AuthTextField
              innerRef={setRef('confirmPassword')}
              placeholder={'confirmPassword'}
              value={values.confirm_password}
              onChange={handleChange('confirmPassword') as () => void}
              onBlur={handleBlur('confirmPassword') as () => void}
              isVisible={true}
              error={errors.confirm_password as string}
              isError={handleError(
                errors.confirm_password as string,
                touched.confirm_password as boolean,
              )}
              keyboardType={'default'}
              styles={{ width: '100%' }}
              onSubmitEditing={() => handleSubmit()}
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
                <Pressable onPress={() => setFieldValue('isConfirmVisible', !values.isConfirmVisible)}>
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

            <Button
              title="Sign Up"
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
      <AppHeader
        title=" "
        goBack
      />
      <View style={styles.content}>
        {renderHeader}
        {renderForm}
      </View>
    </BackGroundLayout>
  );
};

export default SignUpScreen;
