const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    mainPage: './src/pages/main/index.tsx',
    tutorPage: './src/pages/tutor/index.tsx',
    managementAnalyticPage: './src/pages/management-analytic/index.tsx'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(tsx|ts)$/,
        loader: "ts-loader",
        options: { transpileOnly: true },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx", ".tsx", ".ts", ".css"],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: { comments: false },
          format: { comments: false },
          compress: {
            unused: true,
            dead_code: true,
            drop_debugger: false,
            conditionals: true,
            evaluate: true,
            drop_console: false,
            sequences: true,
            booleans: true,
          },
        },
      }),
    ],
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve("..", "static/react"),
  },
};
