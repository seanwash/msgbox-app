import React from "react";
import { useGlobalDispatch } from "../context/GlobalContext";
import { Message } from "../types";

type Props = {
  message: Message;
};

const MessageListItem: React.FC<Props> = ({ message }) => {
  const dispatch = useGlobalDispatch();
  const hasAttachments = message.attachments.length > 0;

  const handleInteraction = (message: any) => {
    return () => {
      dispatch({ type: "selectMessage", payload: { message } });
    };
  };

  return (
    <div
      className={`px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500 ${
        hasAttachments ? "border-r-4 border-blue-500" : ""
      }`}
      onClick={handleInteraction(message)}
      onFocus={handleInteraction(message)}
    >
      <div>{message.subject}</div>
    </div>
  );
};

export default MessageListItem;
