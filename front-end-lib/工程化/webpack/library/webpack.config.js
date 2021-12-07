const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './index.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'output'),
    filename: '[name].js',
    library: {
      name: "webpackNumbers",
      type: "amd"
    }
  },
}
