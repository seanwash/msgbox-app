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

export interface Message {
  _id: number;
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

export interface AttachmentDTO {
  extension: string;
  file: {
    fileName: string;
    content: string;
  };
}

export interface Attachment {
  path: string;
  extension: string;
  fileName: string;
}
