const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: path.join(__dirname, "../src/web/index.tsx"),
  target: "electron-renderer",
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "../dist/renderer.js"),
    compress: true,
    port: 9000,
  },
  resolve: {
    alias: {
      ["web"]: path.join(__dirname, "../src/web"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src\/web/,
        exclude: /node_modules/,
        use: [
          isDevelopment && {
            loader: "babel-loader",
            options: { plugins: ["react-refresh/babel"] },
          },
          { loader: "ts-loader" },
        ].filter(Boolean),
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "renderer.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src/web/index.html"),
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
};
