var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    Poject: './src/javascripts/poject',
  },
  output: {
    path: path.resolve(__dirname, '../../app/assets/javascripts'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' })
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
}
