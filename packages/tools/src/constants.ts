import path from 'path';
import webpack from 'webpack';

export const getWebpackConfig = (pwd: string) =>
  ({
    mode: 'production',
    stats: 'errors-only',
    devtool: false,
    target: 'node',
    entry: path.join(pwd, './dist/js/node/index.js'),
    output: {
      path: path.resolve(pwd, './dist/js/node'),
      libraryTarget: 'commonjs2',
    },
    resolve: {
      alias: {
        // 由于生成器中会使用 @modern-js/plugin-i18n，
        // @modern-js/plugin-i18n 中引用的 @modern-js/utils/lodash 进行了 ncc 打包,
        // 导致再使用 webpack 打包后, lodash 内容出现问题。
        '@modern-js/utils/lodash': require.resolve('lodash'),
      },
    },
    externals: {
      vm2: 'commonjs vm2',
    },
    optimization: {
      minimize: false,
    },
  } as webpack.Configuration);
