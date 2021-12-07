const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  devServer: {
    port: 8000, // 顺便更改一下端口
    hot: true
  },
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: '[name].js'
  },
  /* externals: {
    'react': 'React' // import React from 'react'; => const React = window.React => <script src="xxx">
  }, */
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ]
        }
      }
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, {
        loader: 'css-loader',
        /* options: {
          modules: true
        } */
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          filename: 'react.js',
          chunks: 'all', // async, initial
          test: /[\\/]node_modules[\\/]react[\\/]/
        },
        'react-dom': {
          filename: 'react-dom.js',
          chunks: 'all', // async, initial
          test: /[\\/]node_modules[\\/]react-dom[\\/]/
        },
      }
    }
  }
}
