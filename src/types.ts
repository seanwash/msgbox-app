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
  contentLength: number;
  dataId: number;
  extension: string;
  fileName: string;
  fileNameShort: string;
  name: string;
  file: { fileName: string; content: Uint8Array };
}
