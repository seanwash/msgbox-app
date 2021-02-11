import { IChannel } from "../../types";
import Knex from "knex";

export function fetchAllMessages(knex: Knex): IChannel {
  return {
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
}

export function fetchMessage(knex: Knex): IChannel {
  return {
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
}

export function createMessage(knex: Knex): IChannel {
  return {
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
}

export function deleteMessage(knex: Knex): IChannel {
  return {
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
}
