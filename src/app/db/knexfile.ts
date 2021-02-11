import { Config } from "knex";

export default function (path: string): Config {
  return {
    client: "sqlite3",
    // sqlite doesn't support inserting default values.
    useNullAsDefault: true,
    connection: () => ({
      filename: path,
    }),
    migrations: {
      directory: "src/app/db/migrations",
    },
  };
}
