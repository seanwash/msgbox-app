import React from "react";
import { useGlobalDispatch } from "./context/GlobalContext";
import { Message } from "./types";

type Props = {
  message: Message;
};

const MessageListItem: React.FC<Props> = ({ message }) => {
  const dispatch = useGlobalDispatch();
  const hasAttachments = message.attachments.length > 0;

  const handleClick = (message: any) => {
    return () => {
      dispatch({ type: "selectMessage", payload: { message } });
    };
  };

  return (
    <div
      className={`p-2 hover:bg-gray-300 focus:bg-gray-300 ${
        hasAttachments ? "border-r-4 border-blue-500" : ""
      }`}
      onClick={handleClick(message)}
    >
      <div>{message.subject}</div>
    </div>
  );
};

export default MessageListItem;
