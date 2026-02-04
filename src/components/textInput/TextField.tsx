import { RefAttributes, useCallback, useRef } from 'react';
import {
  ColorValue,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '@themes/index';

export type BaseTextFieldProps = {
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  value: string | undefined;
  onChange?: (value: string) => void;
  onChangeText?: ((text: string) => void) | undefined;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onEndEditing?: (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => void;
  secureTextEntry?: boolean;
  isError?: boolean;
  innerRef?: RefAttributes<TextInput> | any;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, 'onChange'>;

export enum TextFieldStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  DEFAULT = 'DEFAULT',
}

export enum StatusColors {
  SUCCESS = '#00B649',
  ERROR = '#FF1B1B',
  DEFAULT = 'transparent',
}

const TextField: React.FC<BaseTextFieldProps> = ({
  leftComponent,
  rightComponent,
  placeholder,
  value,
  onChange,
  onBlur,
  placeholderTextColor = theme.colors.white80,
  secureTextEntry = false,
  onEndEditing,
  isError,
  onChangeText,
  innerRef,
  disabled,
  style,
  ...props
}) => {
  const handleChangeInput = useCallback(
    ({ nativeEvent: { text } }: { nativeEvent: { text: string } }) => {
      if (onChange) {
        onChange(text);
      }
    },
    [onChange],
  );

  return (
    <View style={[styles.box, isError && styles.error, style]}>
      {leftComponent}
      <TextInput
        ref={innerRef}
        onBlur={onBlur}
        onChange={handleChangeInput}
        style={styles.input}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        autoComplete="off"
        onEndEditing={onEndEditing}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        editable={disabled}
        {...props}
      />
      {rightComponent}
    </View>
  );
};

export default TextField;


const styles = StyleSheet.create({
  box: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.white10,
    flexDirection: 'row',
    borderColor: 'transparent',
    borderWidth: 1,
    marginBottom: theme.spacing.s,
    alignItems: 'center',
    gap: theme.spacing.s,
    borderRadius: theme.spacing.s,
    width: '100%',
  },
  input: {
    padding: 0,
    color: 'white',
    fontSize: theme.fontSize.font14,
    flex: 1,
    width: '100%',
  },
  error: {
    borderColor: theme.colors.error,
  },
});