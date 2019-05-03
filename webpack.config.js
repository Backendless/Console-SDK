'use strict'

module.exports = {
  target: 'node',

  devtool: false,

  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  externals: /^(form-data|\$)$/i,

  module: {
    rules: [
      {
        test   : /\.js$/,
        exclude: /node_modules/,
        loader : 'babel-loader'
      }
    ],
  },

  output: {
    library      : 'BackendlessConsoleSDK',
    libraryTarget: 'umd'
  },

}
