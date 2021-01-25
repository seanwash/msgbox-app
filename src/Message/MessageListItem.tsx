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
    <li
      className={`p-2 hover:bg-gray-300 focus:bg-gray-300 ${
        hasAttachments ? "border-r-4 border-blue-500" : ""
      }`}
      onClick={handleInteraction(message)}
      onFocus={handleInteraction(message)}
    >
      <div>{message.subject}</div>
    </li>
  );
};

export default MessageListItem;
