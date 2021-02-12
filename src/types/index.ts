import { IpcMainInvokeEvent } from "electron";

type TMessageChannelNames =
  | "fetchMessage"
  | "fetchAllMessages"
  | "createMessage"
  | "deleteMessage";

export type TChannelNames = TMessageChannelNames;

export interface IChannel {
  name: TChannelNames;
  // TODO: Should these any's be unknowns instead?
  listener: (event: IpcMainInvokeEvent, message: any) => any;
}

import MsgReader from "@npeersab/msgreader";

export interface Message {
  id: number;
  reader: MsgReader;
  attachments: Attachment[];
  recipients: Recipient[];
  subject: string;
  headers: string;
  body: string;
  senderName: string;
  senderEmail: string;
  compressedRtf: string;
}

export interface Recipient {
  email: string;
  name: string;
}

export interface Attachment {
  path: string; // TODO: Remove this, only used to make MessageViewAttachment work
  contentLength: number;
  dataId: number;
  extension: string;
  fileName: string;
  fileNameShort: string;
  name: string;
  file: { fileName: string; content: Uint8Array };
}
