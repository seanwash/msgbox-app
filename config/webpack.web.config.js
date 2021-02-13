const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
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
        use: [{ loader: "ts-loader" }],
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
  ],
};
