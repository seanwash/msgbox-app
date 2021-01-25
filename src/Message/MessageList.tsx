import React from "react";
import { useGlobalState } from "../context/GlobalContext";
import MessageListItem from "./MessageListItem";

const MessageList = () => {
  const state = useGlobalState();

  return (
    <nav
      className="divide-y divide-gray-200 border-r border-gray-200"
      aria-label="Sidebar"
    >
      {state.messages.map((message, index) => (
        <MessageListItem key={index} message={message} />
      ))}
    </nav>
  );
};

export default MessageList;
