'use strict';

var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  const config = {};

  config.mode = 'development';
  config.devtool = 'inline-source-map';

  config.entry = {
    app: './app.js'
  };

  config.output = {
    path: path.join(__dirname, '/dist/'),
    publicPath: './dist/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  };

  config.module = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        // SASS LOADER
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  };

  config.plugins = [
    new HtmlWebpackPlugin({
      template: '_index.html',
      filename: '../index.html',
      chunks: ['app']
    })
  ];

  return config;
};
