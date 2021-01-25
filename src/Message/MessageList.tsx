import React from "react";
import { useGlobalState } from "../context/GlobalContext";
import MessageListItem from "./MessageListItem";

const MessageList = () => {
  const state = useGlobalState();

  return (
    <ul className="bg-gray-200">
      {state.messages.map((message, index) => (
        <MessageListItem key={index} message={message} />
      ))}
    </ul>
  );
};

export default MessageList;
