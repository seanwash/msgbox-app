import React from "react";
import { useGlobalState } from "./context/GlobalContext";
import MessageListItem from "./MessageListItem";

const MessageList = () => {
  const state = useGlobalState();

  return (
    <div className="bg-gray-200 w-1/4">
      {state.messages.map((message, index) => (
        <MessageListItem key={index} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
