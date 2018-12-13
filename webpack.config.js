const path = require('path');
const webpack = require('webpack');

const mode = process.env.BUILD_MODE || 'development';

const config = {
  entry: {
    "main": "./index.js",
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: mode === 'development' ? `frozen.bundle.js` : `frozen.bundle.min.js`
  },
  mode,
};

if(mode === 'development') {
  config.plugins = [
    new webpack.SourceMapDevToolPlugin({})
  ];
}

module.exports = config;