import React, {PropsWithChildren} from 'react';
import {View, StyleSheet, ViewStyle, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../themes/index';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  containerStyle?: ViewStyle;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
};

const BackGroundLayout = ({
  children,
  containerStyle,
  edges,
}: PropsWithChildren<Props>) => {
  return (
    <SafeAreaView style={styles.layout} edges={edges ?? ['top']}>
      <LinearGradient
        colors={theme.colors.gradients.background}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={160}
      />
      <View style={[styles.container, containerStyle]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
});

export default BackGroundLayout;