import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../../themes/index';
export { UserIcon, UserGroupIcon } from '../image';

interface IconProps {
  height?: number;
  width?: number;
  color?: string;
}

export const Expense: React.FC<IconProps> = ({
  height = 24,
  width = 24,
  color = theme.text.colors.primary,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Text
        style={[
          styles.dollarSign,
          {
            color,
            fontSize: width * 0.9,
            lineHeight: width,
          },
        ]}>
        $
      </Text>
    </View>
  );
};

export const Camera: React.FC<IconProps> = ({
  height = 24,
  width = 24,
  color = theme.text.colors.primary,
}) => {
  const bodyWidth = width * 0.7;
  const bodyHeight = height * 0.6;
  const lensSize = width * 0.35;
  return (
    <View style={[styles.container, { width, height }]}>
      <View
        style={[
          styles.cameraBody,
          {
            width: bodyWidth,
            height: bodyHeight,
            borderColor: color,
            borderWidth: 2,
            borderRadius: width * 0.1,
          },
        ]}
      />
      <View
        style={[
          styles.cameraLens,
          {
            width: lensSize,
            height: lensSize,
            borderColor: color,
            borderWidth: 2,
            borderRadius: lensSize / 2,
            top: bodyHeight * 0.2,
          },
        ]}
      />
      <View
        style={[
          styles.cameraFlash,
          {
            width: width * 0.15,
            height: width * 0.1,
            backgroundColor: color,
            borderRadius: 2,
            top: bodyHeight * 0.1,
            right: bodyWidth * 0.15,
          },
        ]}
      />
    </View>
  );
};

export const Gallery: React.FC<IconProps> = ({
  height = 24,
  width = 24,
  color = theme.text.colors.primary,
}) => {
  const imageWidth = width * 0.8;
  const imageHeight = height * 0.8;
  return (
    <View style={[styles.container, { width, height }]}>
      <View
        style={[
          styles.galleryFrame,
          {
            width: imageWidth,
            height: imageHeight,
            borderColor: color,
            borderWidth: 2,
            borderRadius: width * 0.1,
          },
        ]}>
        <View
          style={[
            styles.galleryLine,
            {
              width: imageWidth,
              borderColor: color,
              borderWidth: 1,
              top: imageHeight / 3,
            },
          ]}
        />
        <View
          style={[
            styles.galleryLine,
            {
              width: imageWidth,
              borderColor: color,
              borderWidth: 1,
              top: (imageHeight * 2) / 3,
            },
          ]}
        />
        <View
          style={[
            styles.galleryLine,
            {
              height: imageHeight,
              borderColor: color,
              borderWidth: 1,
              left: imageWidth / 3,
            },
          ]}
        />
        <View
          style={[
            styles.galleryLine,
            {
              height: imageHeight,
              borderColor: color,
              borderWidth: 1,
              left: (imageWidth * 2) / 3,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHead: {
    alignSelf: 'center',
  },
  profileBody: {
    alignSelf: 'center',
  },
  peopleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  person: {
    alignSelf: 'center',
  },
  personMiddle: {
    marginHorizontal: -3,
    zIndex: 1,
  },
  personRight: {
    zIndex: 0,
  },
  dollarSign: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraBody: {
    position: 'absolute',
    alignSelf: 'center',
  },
  cameraLens: {
    position: 'absolute',
    alignSelf: 'center',
  },
  cameraFlash: {
    position: 'absolute',
  },
  galleryFrame: {
    position: 'absolute',
    alignSelf: 'center',
  },
  galleryLine: {
    position: 'absolute',
  },
});
