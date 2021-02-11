import { ipcMain } from "electron";
import Knex from "knex";

import { IChannel } from "../../types";

import {
  fetchAllMessages,
  fetchMessage,
  createMessage,
  deleteMessage,
} from "./message.channel";

export default function (knex: Knex) {
  // TODO: There has to be a better way to do this.
  const availableChannels: IChannel[] = [
    fetchAllMessages(knex),
    fetchMessage(knex),
    createMessage(knex),
    deleteMessage(knex),
  ];

  availableChannels.forEach(({ name, listener }) => {
    ipcMain.handle(name, listener);
  });
}
