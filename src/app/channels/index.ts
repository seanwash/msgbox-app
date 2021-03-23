import { ipcMain } from "electron";

import { IChannel } from "../../types";

import {
  fetchAllMessages,
  fetchMessage,
  createMessage,
  deleteMessage,
  markMessageAsRead,
} from "./message";

export default function (): void {
  const availableChannels: IChannel[] = [
    fetchAllMessages,
    fetchMessage,
    createMessage,
    deleteMessage,
    markMessageAsRead,
  ];

  availableChannels.forEach(({ name, listener }) => {
    ipcMain.handle(name, listener);
  });
}
