import { ipcMain } from "electron";

import { IChannel } from "../../types";

import {
  fetchAllMessages,
  fetchMessage,
  createMessage,
  deleteMessage,
} from "./message.channel";

export default function () {
  const availableChannels: IChannel[] = [
    fetchAllMessages,
    fetchMessage,
    createMessage,
    deleteMessage,
  ];

  availableChannels.forEach(({ name, listener }) => {
    ipcMain.handle(name, listener);
  });
}
