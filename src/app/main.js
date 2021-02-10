"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
// DB Setup, auto run migrations
var userDataPath = electron_1.app.getPath("userData");
var dbName = "msgbox.db";
var knexConfig = require("./knexfile")(path.join(userDataPath, dbName), isDev);
var knex = require("knex")(knexConfig);
knex.migrate
    .latest(knexConfig)["catch"](function (err) { return console.log("-----", "migration err", err); });
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    electron_1.app.quit();
}
function createWindow() {
    var win = new electron_1.BrowserWindow({
        height: 900,
        width: 1400,
        webPreferences: {
            // TODO: Ideally we want to swap these values. Node Integration feels like
            // a bit of a trap.
            contextIsolation: false,
            nodeIntegration: true,
            preload: __dirname + "/preload.js"
        }
    });
    win.loadURL(isDev
        ? "http://localhost:3000"
        : "file://" + path.join(__dirname, "../build/index.html"));
    // TODO: These listeners should be abstracted away to somewhere else.
    electron_1.ipcMain.handle("createMessage", function (event, message) {
        // TODO: Handle the saving of images
        console.log("-----", "", message.attachments &&
            message.attachments.map(function (attachment) { return attachment.fileName; }));
        return knex
            .from("messages")
            .insert(message)
            .then(function (result) {
            return result;
        });
    });
    electron_1.ipcMain.handle("fetchAllMessages", function (event) {
        return knex
            .from("messages")
            .select()
            .then(function (response) {
            return response;
        });
    });
    electron_1.ipcMain.handle("fetchMessage", function (event, id) {
        return knex
            .from("messages")
            .where({ id: id })
            .first()
            .then(function (result) {
            return result;
        });
    });
    electron_1.ipcMain.handle("deleteMessage", function (event, id) {
        return knex
            .from("messages")
            .where({ id: id })
            .del()
            .then(function (result) {
            return result;
        });
    });
}
electron_1.app.whenReady().then(createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
