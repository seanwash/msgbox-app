import React, { useCallback, useEffect, useState } from "react";
import MessageListItem from "./MessageListItem";
import { Message } from "../../types";
import { useGlobalDispatch } from "../../context/GlobalContext";
import MessageDrop from "./MessageDrop";
import { ipcRenderer } from "electron";

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const dispatch = useGlobalDispatch();

  const onSelect = (message: Message) => {
    dispatch({ type: "selectMessage", id: message.id });
  };

  const onDelete = async (message: Message) => {
    ipcRenderer.sendSync("deleteMessage", message.id);
    getAllMessages();
  };

  const getAllMessages = useCallback(() => {
    // TODO: Handle Errors
    const messages = ipcRenderer
      .sendSync("fetchAllMessages")
      .map((message: any) => ({
        ...message,
        recipients: message.recipients ? JSON.parse(message.recipients) : [],
        attachments: message.attachments ? JSON.parse(message.attachments) : [],
      }));
    setMessages(messages);
  }, []);

  useEffect(() => {
    getAllMessages();
  }, [getAllMessages]);

  return (
    <>
      <MessageDrop onImport={getAllMessages} />

      <div className="overflow-y-auto">
        <nav
          className="divide-y divide-gray-200 border-r border-gray-200"
          aria-label="Sidebar"
        >
          {messages.map((message) => {
            return (
              <MessageListItem
                key={message.id}
                message={message}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default MessageList;
