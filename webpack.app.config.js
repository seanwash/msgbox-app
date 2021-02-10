const path = require("path");

module.exports = {
  entry: "./src/app/main.ts",
  target: "electron-main",
  resolve: {
    alias: {
      ["app"]: path.resolve(__dirname, "src/app"),
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
    path: __dirname + "/dist",
    filename: "main.js",
  },
  externals: { sqlite3: "commonjs2 sqlite3", knex: "commonjs knex" },
};
