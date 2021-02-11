import { app, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";
import setup from "./db";
const knex = setup(app);
import registerChannels from "./channels";

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

  // Register all of the available channels that listen for messages sent by the renderer process.
  registerChannels(knex);
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
