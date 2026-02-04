import { PixelRatio } from "react-native";

const fontScale = PixelRatio.getFontScale();

export const theme = {
  text: {
    colors: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF80',
      darkGrey: '#EBEBF599',
    },
  },
  colors: {
    white: '#FFFFFF',
    grey: '#464646',
    darkGrey: '#252525',
    black: '#151515',
    green: '#00B649',
    white10: '#FFFFFF1F',
    white80: '#FFFFFF80',
    white20: '#FFFFFF33',
    blue: '#005CEE',
    success: '#4FCE25',
    error: '#FF1B1B',
    gray: '#9E9E9E',
    loaderColor: '#005CEE',
    coral: '#FF6B6B',
    teal: '#4ECDC4',
    yellow: '#FFE66D',
    mint: '#A8E6CF',
    gradients: {
      primary: ['#FF338D', '#C01EA7'],
      background: ['#242424', '#0F0F0F'],
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    l: 24,
    lx: 32,
    xl: 40,
    xls: 48,
    xxl: 64,
  },
  fontSize: {
    font12: 12 * fontScale,
    font14: 14 * fontScale,
    font16: 16 * fontScale,
    font18: 18 * fontScale,
    font20: 20 * fontScale,
    font24: 24 * fontScale,
    font28: 28 * fontScale,
    font32: 32 * fontScale,
    font48: 48 * fontScale,
  },
};
