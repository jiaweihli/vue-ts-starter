import * as path from 'path';

import { Configuration, NewModule } from 'webpack';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as glob from 'glob';

import { default as buildDevelopmentConfig } from './build.development.webpack.config';

const config: Configuration = {
  // The nyc/istanbul packages require inline source maps in order to do line mappings.
  devtool: 'inline-source-map',
  entry: glob.sync('./test/**/*.ts', { ignore: glob.sync('./test/dist/**/*.ts') }),
  externals: ['ava'],
  module: {
    rules: (buildDevelopmentConfig.module as NewModule).rules.concat([
      {
        enforce: 'post',
        exclude: /node_modules|\.test\.ts$/,
        test: /\.ts$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true
          }
        }
      }
    ])
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '..', 'test', 'dist')
  },
  plugins: [
    new ExtractTextPlugin('style.css')
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};

export { config as default };
