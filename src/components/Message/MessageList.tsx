import React, { useCallback, useEffect, useState } from "react";
import MessageListItem from "./MessageListItem";
import { useIndexedDB } from "react-indexed-db";
import { Message } from "../../types";
import { useGlobalDispatch } from "../../context/GlobalContext";
import MessageDrop from "./MessageDrop";

const MessageList = () => {
  const { getAll, deleteRecord } = useIndexedDB("messages");
  const [messages, setMessages] = useState<Message[]>([]);
  const dispatch = useGlobalDispatch();

  const onSelect = (message: Message) => {
    dispatch({ type: "selectMessage", id: message.id });
  };

  const onDelete = async (message: Message) => {
    await deleteRecord(message.id);
    getAllMessages();
  };

  const getAllMessages = useCallback(() => {
    getAll().then((messagesFromDB) => {
      setMessages(messagesFromDB);
    });
  }, [getAll]);

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
          {messages.map((message) => (
            <MessageListItem
              key={message.id}
              message={message}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </nav>
      </div>
    </>
  );
};

export default MessageList;
