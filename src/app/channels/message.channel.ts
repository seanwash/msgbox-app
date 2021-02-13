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

    if (args.search?.length > 1) {
      // https://github.com/pouchdb-community/pouchdb-quick-search
      // TODO: Is there a way to make the search plugin work with TS?
      // @ts-ignore
      return await db.search<Message>({
        include_docs: true,
        query: args.search,
        fields: {
          subject: 5,
          message: 1,
        },
        mm: "33%",
        ...opts,
      });
    } else {
      return await db.allDocs<Message>({
        include_docs: true,
        ...opts,
      });
    }
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
      // TODO: Files should live in a directory with other files separated by attachment id.
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

    try {
      const result = await db.post(message);
      console.log("-----", "created message", result.id);
      return result;
    } catch (err) {
      console.log("-----", "failed to create", err);
    }
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
