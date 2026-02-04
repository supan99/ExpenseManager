import React, { FC, ReactNode } from 'react';
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';

import { theme } from '@themes/index';
import BaseTextField from '../TextField';
import AppText from '@components/text/AppText';

type Props = {
  innerRef?: React.RefAttributes<TextInput> | any;
  value: string | undefined;
  onChange: () => void;
  onBlur: () => void;
  isError: boolean | undefined;
  error: string | undefined;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  isVisible?: boolean;
  onSubmitEditing?:
    | ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
    | undefined;
  styles: any;
};

const AuthTextField: FC<Props> = ({
  innerRef,
  value,
  onChange,
  onBlur,
  isError,
  error,
  placeholder,
  keyboardType,
  leftComponent,
  rightComponent,
  isVisible,
  onSubmitEditing,
  styles,
}) => (
  <View style={styles}>
    <BaseTextField
      innerRef={innerRef}
      textContentType="none"
      autoCorrect={false}
      keyboardType={keyboardType}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      secureTextEntry={isVisible}
      leftComponent={leftComponent}
      rightComponent={rightComponent}
      isError={isError}
      onSubmitEditing={onSubmitEditing}
    />
    {isError && (
      <AppText
        text={error}
        variant="error"
        style={AuthTextFieldStyles.errorText}
      />
    )}
  </View>
);


const AuthTextFieldStyles = StyleSheet.create({
  errorText: {
    fontSize: theme.fontSize.font12,
    marginVertical: theme.spacing.xs,
  },
});
export default AuthTextField;
