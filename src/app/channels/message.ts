import { app } from "electron";
import path from "path";
import fs from "fs";
import { Db } from "../db";
import { Attachment, AttachmentDTO, IChannel, Message } from "../../types";
import cuid from "cuid";

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
    const messageId = cuid();
    const attachmentBaseDir = `${DATA_DIR}/${messageId}`;
    const attachmentData: Attachment[] = [];

    // If the attachments directory doesn't exist, then it should be created
    // so that saving attachments doesn't error.
    // TODO: Refactor this to somewhere else.
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR);
    }

    // Only create the nested attachment dir if the message has any attachments.
    if (message.attachments?.length) {
      fs.mkdirSync(attachmentBaseDir);
    }

    message.attachments.forEach((attachment: AttachmentDTO) => {
      const attachmentPath = `${attachmentBaseDir}/${attachment.file.fileName}`;

      fs.writeFileSync(attachmentPath, Buffer.from(attachment.file.content), {
        flag: "w", // create if doesn't already exist
      });

      attachmentData.push({
        fileName: attachment.file.fileName,
        extension: attachment.extension,
        path: attachmentPath,
      });
    });

    message._id = messageId;
    message.attachments = attachmentData;

    try {
      return await db.put(message);
    } catch (err) {
      console.log("-----", "failed to create", err);
    }
  },
};

export const deleteMessage: IChannel = {
  name: "deleteMessage",
  listener: async (event, id) => {
    const doc = await db.get<Message>(id);
    const attachmentDir = `${DATA_DIR}/${doc._id}`;
    const hasAttachments = fs.existsSync(attachmentDir);

    if (hasAttachments) {
      fs.rmdirSync(attachmentDir, { recursive: true });
    }

    return await db.remove(doc);
  },
};

export const markMessageAsRead: IChannel = {
  name: "markMessageAsRead",
  listener: async (event, id) => {
    try {
      const doc = await db.get<Message>(id);
      return await db.put<Message>({
        ...doc,
        read: true,
      });
    } catch (err) {
      console.log("-----", "failed to create", err);
      return { error: err.toString() };
    }
  },
};
