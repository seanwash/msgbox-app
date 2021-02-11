import { app, BrowserWindow, ipcMain } from "electron";
import * as isDev from "electron-is-dev";
import setup from "./db";
const knex = setup(app);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

function createWindow() {
  const win = new BrowserWindow({
    height: 900,
    width: 1400,
    webPreferences: {
      // TODO: Ideally we want to swap these values. Node Integration feels like
      // a bit of a trap.
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev ? "http://localhost:9000" : `file://${app.getAppPath()}/index.html`
  );

  // TODO: These listeners should be abstracted away to somewhere else.
  ipcMain.handle("createMessage", (event, message) => {
    // TODO: Handle the saving of images
    return knex
      .from("messages")
      .insert(message)
      .then((result: any) => {
        return result;
      });
  });

  ipcMain.handle("fetchAllMessages", (event) => {
    return knex
      .from("messages")
      .select()
      .then((response) => {
        return response;
      });
  });

  ipcMain.handle("fetchMessage", (event, id) => {
    return knex
      .from("messages")
      .where({ id })
      .first()
      .then((result) => {
        return result;
      });
  });

  ipcMain.handle("deleteMessage", (event, id) => {
    return knex
      .from("messages")
      .where({ id })
      .del()
      .then((result) => {
        return result;
      });
  });
}

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
