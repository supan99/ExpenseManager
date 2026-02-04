import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '../components/textInput/TextField';
import { Button } from '../components/Button';
import { authApi } from '../api/auth';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';
import { navigateToHome } from '../services/navigationHandler';
import BackGroundLayout from '../components/BackGroundLayout';
import { theme } from '../themes/index';
import { setKeyChain } from '../services/keyChain';
import { KeyChainKeys } from '../enums/keyChainKeys';

interface LoginFormValues {
  email: string;
  password: string;
}

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .trim(),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues: LoginFormValues = {
    email: 'invesqtest@email.com',
    password: '',
  };

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    setLoading(true);
    try {
      const response = await authApi.signIn({
        email: values.email.trim(),
        password: values.password,
      });

      console.log('Login response', response);

      if (response?.data) {
        const { access_token, contact } = response.data;

        const user = {
          id: contact.id,
          name: `${contact.firstname} ${contact.lastname}`.trim(),
          email: contact.email,
          avatar: contact.profile_image || undefined,
          firstname: contact.firstname,
          lastname: contact.lastname,
          phonenumber: contact.phonenumber,
          title: contact.title,
        };

        await setKeyChain(KeyChainKeys.TOKEN, access_token);
        await dispatch(login({ token: access_token, user })).unwrap();
        navigateToHome();
      }
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message ||
          error.response?.data?.message ||
          'Invalid email or password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackGroundLayout containerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
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
              }) => (
                <View style={styles.form}>
                  {/* <TextField
                    label="Email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={
                      touched.email && errors.email ? errors.email : undefined
                    }
                    editable={!loading}
                  /> */}

                  {/* <TextField
                    label="Password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry
                    showPasswordToggle={true}
                    error={
                      touched.password && errors.password
                        ? errors.password
                        : undefined
                    }
                    editable={!loading}
                  /> */}

                  <Button
                    title="Login"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    style={styles.loginButton}
                  />
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackGroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: theme.fontSize.font32,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.font16,
    color: theme.text.colors.secondary,
    marginBottom: theme.spacing.lx,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: theme.spacing.xs,
  },
});
