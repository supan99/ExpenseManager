
import { theme } from '@themes/index';
import React from 'react';
import {
  Text as TextRN,
  TextProps as TextRNProps,
  StyleSheet,
} from 'react-native';

type Variants = 'title' | 'regular' | 'subtitle' | 'deleted' | 'error';

type Props = TextRNProps & {
  text: string | React.ReactNode;
  variant?: Variants;
};

const AppText = ({ style, text, variant = 'regular', ...props }: Props) => {
  return (
    <TextRN style={[styles.common, styles[variant], style]} {...props}>
      {text}
    </TextRN>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSize.font24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: theme.colors.white,
  },
  subtitle: {
    fontSize: theme.fontSize.font16,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  regular: {
    fontSize: theme.fontSize.font14,
    color: theme.colors.white,
  },
  common: {
    fontFamily:
      'Poppins-Regular, Poppins, Poppins-Regular, Poppins-Bold, Poppins-Medium, Poppins-SemiBold, Poppins-Light, Poppins-ExtraLight, Poppins-Thin, sans-serif',
    fontStyle: 'normal',
    fontWeight: 'regular',
  },
  deleted: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: theme.colors.white80,
  },
  error: {
    color: theme.colors.error,
  },
});

export default AppText;
