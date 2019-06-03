const combineLoaders = require('webpack-combine-loaders');

module.exports = {
  entry: './index/app.jsx',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        loader: 'babel-loader',
        query: {
          presets: ["@babel/react", "@babel/env"]
        },
        test: /\.jsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: combineLoaders([
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }
        ])
      }

    ],
  }
};
