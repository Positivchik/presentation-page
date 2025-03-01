const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './node/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist', 'node'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {},
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
};
