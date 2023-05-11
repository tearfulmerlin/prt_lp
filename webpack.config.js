const path = require('path');

module.exports = {
  entry: './prt-server.js',
  mode: 'production',
  target: 'node10.19',
  output: {
    path: path.resolve(__dirname, '.build'),
    filename: './[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  }
};