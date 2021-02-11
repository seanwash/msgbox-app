import { setup } from "../db";
import { IChannel } from "../../types";

const knex = setup();

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
    // TODO: Handle the saving of images
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
    return knex
      .from("messages")
      .where({ id })
      .del()
      .then((result) => {
        return result;
      });
  },
};
