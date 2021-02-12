import { app } from "electron";
import getConfig from "./knexfile";
import path from "path";
import setup from "./setup";

// TODO: Dedupe with ./setup.ts
const DATABASE_NAME = "MsgBox.db";

export default function migrate() {
  const userDataPath = app.getPath("userData");
  const config = getConfig(path.join(userDataPath, DATABASE_NAME));
  const knex = setup();

  // Ensure that the DB has the latest schema applied.
  knex.migrate
    .latest(config.migrations)
    .catch((err: Error) => console.log("-----", "migration err", err));
}
