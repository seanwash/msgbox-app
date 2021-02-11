import * as path from "path";
import * as isDev from "electron-is-dev";
import Knex from "knex";
import buildKnexConfig from "./knexfile";

const DATABASE_NAME = "msgbox.db";

const setup = (app: Electron.App) => {
  const userDataPath = app.getPath("userData");
  const config = buildKnexConfig(path.join(userDataPath, DATABASE_NAME), isDev);
  const knex = Knex(config);

  // Ensure that the DB has the latest schema applied.
  knex.migrate
    .latest(config.migrations)
    .catch((err: Error) => console.log("-----", "migration err", err));

  return knex;
};

export default setup;
