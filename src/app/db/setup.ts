import { app } from "electron";
import * as path from "path";
import Pouch from "pouchdb";

const DATABASE_NAME = "MsgBox.db";

export default function setup() {
  const userDataPath = app.getPath("userData");
  // new Pouch(path.join(userDataPath, DATABASE_NAME)).destroy();
  return new Pouch(path.join(userDataPath, DATABASE_NAME));
}
