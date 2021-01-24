import React from "react";
import { useGlobalDispatch } from "./context/GlobalContext";
import { Message } from "./types";

type Props = {
  message: Message;
};

const MessageListItem: React.FC<Props> = ({ message }) => {
  const dispatch = useGlobalDispatch();

  const handleClick = (message: any) => {
    return () => {
      dispatch({ type: "selectMessage", payload: { message } });
    };
  };

  return (
    <div
      className="hover:bg-gray-300 focus:bg-gray-300"
      onClick={handleClick(message)}
    >
      <div>{message.subject}</div>
    </div>
  );
};

export default MessageListItem;
