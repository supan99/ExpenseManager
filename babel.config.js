module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // Adjust this to your source code root
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@consts': './src/consts',
          '@context': './src/context',
          '@enums': './src/enums',
          '@hocs': './src/hocs',
          '@hooks': './src/hooks',
          '@layouts': './src/layouts',
          '@localize': './src/localize',
          '@models': './src/models',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@themes': './src/themes',
          '@types': './src/types',
          '@utils': './src/utils',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
