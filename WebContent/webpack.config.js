var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    async: 'async'
  },
  mode: "development",
  devtool: "source-map"
};