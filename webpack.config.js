const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/scripts'),
    filename: 'index.js'
  },
  plugins: [
    new Dotenv({
      systemvars: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
