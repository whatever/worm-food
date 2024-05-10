const webpack = require('webpack');

module.exports = {
  context: __dirname + "/src",
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'pool-water.bundled.js',
    libraryTarget: 'var',
    library: 'svv',
  },
  module: {
    rules: [
      {
        test: /\.gltf$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(frag|vert)?$/,
        loader: 'raw-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  mode: "development",
};
