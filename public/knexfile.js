module.exports = function (path, isDev) {
  return {
    client: "sqlite3",
    connection: () => ({
      debug: isDev,
      filename: path,
    }),
    migrations: {
      directory: "./public/migrations",
    },
  };
};
