const environment = require('./environment')
const ManifestPlugin = require('webpack-manifest-plugin')

const webpack = require('webpack');
const path = require('path');

module.exports = Object.assign({}, environment.toWebpackConfig(), {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
    new ManifestPlugin({ publicPath: '/packs/', writeToFileEmit: true })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-1', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader?mimetype=application/font-woff'
      }
    ]
  }
})
