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
    optimization: {
      minimize: false,
    },
  } as webpack.Configuration);
