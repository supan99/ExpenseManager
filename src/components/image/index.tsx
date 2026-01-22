import React from 'react';
import UserIconSvg from '../../assets/icons/userICON.svg';
import UserGroupIconSvg from '../../assets/icons/userGroup.svg';
import BackButtonIconSvg from '../../assets/icons/arrowLeft.svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const UserIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#FFFFFF',
}) => {
  return (
    <UserIconSvg
      width={width}
      height={height}
      color={color}
    />
  );
};

export const UserGroupIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#FFFFFF',
}) => {
  return (
    <UserGroupIconSvg
      width={width}
      height={height}
      color={color}
    />
  );
};


export const BackButtonIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#FFFFFF',
}) => {
  return (
    <BackButtonIconSvg
      width={width}
      height={height}
      color={color}
    />
  );
};