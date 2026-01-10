module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': '.',
            '@app': './app',
            '@components': './app/components',
            '@screens': './app/screens',
            '@navigation': './app/navigation',
            '@hooks': './app/hooks',
            '@context': './app/context',
            '@services': './app/services',
            '@utils': './app/utils',
            '@constants': './app/constants',
            '@theme': './app/theme',
            '@types': './app/types',
            '@features': './app/features',
            '@mock': './mock',
            '@config': './config',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
