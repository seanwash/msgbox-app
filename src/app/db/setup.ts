import { app } from "electron";
import * as path from "path";
import Knex from "knex";
import getConfig from "./knexfile";

const DATABASE_NAME = "msgbox.db";

export default function setup() {
  const userDataPath = app.getPath("userData");
  const config = getConfig(path.join(userDataPath, DATABASE_NAME));
  return Knex(config);
}
