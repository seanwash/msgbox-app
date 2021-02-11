import { Config } from "knex";

export default function (path, isDev): Config {
  return {
    client: "sqlite3",
    connection: () => ({
      debug: isDev,
      filename: path,
    }),
    migrations: {
      directory: "src/app/db/migrations",
    },
  };
}
