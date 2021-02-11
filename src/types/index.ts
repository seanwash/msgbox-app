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
