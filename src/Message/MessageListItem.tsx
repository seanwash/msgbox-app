import React from "react";
import { useGlobalDispatch } from "../context/GlobalContext";
import { Message } from "../types";

type Props = {
  message: Message;
};

const MessageListItem: React.FC<Props> = ({ message }) => {
  const dispatch = useGlobalDispatch();

  const handleInteraction = (message: any) => {
    return () => {
      dispatch({ type: "selectMessage", payload: { message } });
    };
  };

  return (
    <div
      className={`px-6 py-5 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500`}
      onClick={handleInteraction(message)}
      onFocus={handleInteraction(message)}
    >
      <div className="mb-2">{message.subject}</div>

      {message.attachments.map((attachment) => (
        <span
          key={attachment.dataId}
          className="text-xs px-2 py-1 bg-blue-200 rounded-sm mr-1"
        >
          {attachment.extension}
        </span>
      ))}
    </div>
  );
};

export default MessageListItem;
