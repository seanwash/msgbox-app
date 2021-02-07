const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");

// DB Setup, auto run migrations
const userDataPath = app.getPath("userData");
const dbName = "msgbox.db";
const knexConfig = require("./knexfile")(
  path.join(userDataPath, dbName),
  isDev
);
const knex = require("knex")(knexConfig);
knex.migrate
  .latest(knexConfig)
  .catch((err) => console.log("-----", "migration err", err));

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
      preload: __dirname + "/preload.js",
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // TODO: These listeners should be abstracted away to somewhere else.
  ipcMain.on("createMessage", (event, message) => {
    knex
      .from("messages")
      .insert(message)
      .then((result) => {
        event.returnValue = result;
      });
  });

  ipcMain.on("fetchAllMessages", (event) => {
    knex
      .from("messages")
      .select()
      .then((response) => {
        event.returnValue = response;
      });
  });

  ipcMain.on("fetchMessage", (event, id) => {
    knex
      .from("messages")
      .where({ id })
      .first()
      .then((result) => {
        event.returnValue = result;
      });
  });

  ipcMain.on("deleteMessage", (event, id) => {
    knex
      .from("messages")
      .where({ id })
      .del()
      .then((result) => {
        event.returnValue = result;
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
