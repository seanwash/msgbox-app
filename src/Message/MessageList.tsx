import React, { useEffect, useState } from "react";
import MessageListItem from "./MessageListItem";
import { useIndexedDB } from "react-indexed-db";
import { Message } from "../types";

const MessageList = () => {
  const { getAll } = useIndexedDB("messages");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    getAll().then((messagesFromDB) => {
      setMessages(messagesFromDB);
    });
  }, [getAll]);

  return (
    <nav
      className="divide-y divide-gray-200 border-r border-gray-200"
      aria-label="Sidebar"
    >
      {messages.map((message) => (
        <MessageListItem key={message.id} message={message} />
      ))}
    </nav>
  );
};

export default MessageList;
