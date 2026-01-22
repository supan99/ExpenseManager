import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../themes/index';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  showPasswordToggle = false,
  secureTextEntry: secureTextEntryProp,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const shouldShowPasswordToggle = showPasswordToggle && secureTextEntryProp;
  const secureTextEntry = shouldShowPasswordToggle
    ? !isPasswordVisible
    : secureTextEntryProp;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            shouldShowPasswordToggle && styles.inputWithIcon,
          ]}
          placeholderTextColor={theme.text.colors.secondary}
          accessibilityLabel={label || props.placeholder}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {shouldShowPasswordToggle && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.eyeIcon}>
              {isPasswordVisible ? '👁' : '👁‍🗨'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: theme.fontSize.font14,
    fontWeight: '600',
    color: theme.text.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.white20,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.font16,
    backgroundColor: theme.colors.white10,
    color: theme.text.colors.primary,
  },
  inputWithIcon: {
    paddingRight: theme.spacing.xls,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  eyeIcon: {
    fontSize: theme.fontSize.font20,
    color: theme.text.colors.primary,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.font12,
    marginTop: theme.spacing.xs,
  },
});
