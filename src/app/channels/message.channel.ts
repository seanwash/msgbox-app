import { app } from "electron";
import path from "path";
import fs from "fs";
import { setup } from "../db";
import { IChannel, Attachment } from "../../types";

const knex = setup();
// TODO: We need to make sure that this dir exists before we can write to it.
const DATA_DIR = path.join(app.getPath("userData"), "MsgBoxAttachments");

export const fetchAllMessages: IChannel = {
  name: "fetchAllMessages",
  listener: (_event, _message) => {
    return knex
      .from("messages")
      .select()
      .then((response) => {
        return response;
      });
  },
};

export const fetchMessage: IChannel = {
  name: "fetchMessage",
  listener: (event, id) => {
    return knex
      .from("messages")
      .where({ id })
      .first()
      .then((result) => {
        return result;
      });
  },
};

export const createMessage: IChannel = {
  name: "createMessage",
  listener: (event, message) => {
    // TODO: EW. Don't judge me.
    let attachmentData: Record<string, string>[] = [];

    message.attachments.forEach((attachment: Attachment) => {
      const path = `${DATA_DIR}/${attachment.file.fileName}`;

      fs.writeFileSync(path, Buffer.from(attachment.file.content), {
        flag: "w", // create if doesn't already exist
      });

      attachmentData.push({
        fileName: attachment.file.fileName,
        extension: attachment.extension,
        path,
      });
    });

    message.attachments = JSON.stringify(attachmentData);

    return knex
      .from("messages")
      .insert(message)
      .then((result: any) => {
        return result;
      });
  },
};

export const deleteMessage: IChannel = {
  name: "deleteMessage",
  listener: (event, id) => {
    // TODO: We must also delete any existing attachments.

    return knex
      .from("messages")
      .where({ id })
      .del()
      .then((result) => {
        return result;
      });
  },
};
