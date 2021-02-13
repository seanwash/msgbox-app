const path = require("path");

module.exports = {
  entry: path.join(__dirname, "../src/app/main.ts"),
  target: "electron-main",
  resolve: {
    alias: {
      ["app"]: path.join(__dirname, "../src/app"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src\/app/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "main.js",
  },
  externals: {
    sqlite3: "commonjs sqlite3",
    knex: "commonjs knex",
    pouchdb: "commonjs pouchdb",
  },
};
