import { app } from "electron";
import path from "path";
import fs from "fs";
import { Db } from "../db";
import { Attachment, AttachmentDTO, IChannel, Message } from "../../types";

const db = Db();
// TODO: We need to make sure that this dir exists before we can write to it.
const DATA_DIR = path.join(app.getPath("userData"), "MsgBox.Attachments");

export const fetchAllMessages: IChannel = {
  name: "fetchAllMessages",
  listener: async (_event, args) => {
    const opts = { limit: 2, skip: 0, ...args };

    return await db.allDocs<Message>({
      include_docs: true,
      ...opts,
    });
  },
};

export const fetchMessage: IChannel = {
  name: "fetchMessage",
  listener: async (event, id) => {
    return await db.get<Message>(id);
  },
};

export const createMessage: IChannel = {
  name: "createMessage",
  listener: async (event, message) => {
    // TODO: EW. Don't judge me.
    let attachmentData: Attachment[] = [];

    message.attachments.forEach((attachment: AttachmentDTO) => {
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

    message.attachments = attachmentData;

    return await db.post(message);
  },
};

export const deleteMessage: IChannel = {
  name: "deleteMessage",
  listener: async (event, id) => {
    const doc = await db.get<Message>(id);

    doc.attachments.forEach((attachment: Attachment) => {
      try {
        fs.unlinkSync(attachment.path);
      } catch (err) {
        console.log("----- Error", "deleteMessage", err);
      }
    });

    return await db.remove(doc);
  },
};
