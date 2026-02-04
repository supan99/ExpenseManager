const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['react-native', 'require', 'default'],
    unstable_conditionsByPlatform: {
      android: ['react-native', 'native'],
      ios: ['react-native', 'native'],
    },
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
};

module.exports = mergeConfig(defaultConfig, config);
