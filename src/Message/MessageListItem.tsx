import React from "react";
import { useGlobalDispatch } from "../context/GlobalContext";
import { Message } from "../types";
import { useIndexedDB } from "react-indexed-db";

type Props = {
  message: Message;
};

const MessageListItem: React.FC<Props> = ({ message }) => {
  const { deleteRecord } = useIndexedDB("messages");
  const dispatch = useGlobalDispatch();

  const handleInteraction = () => {
    dispatch({ type: "selectMessage", id: message.id });
  };

  const handleDelete = async () => {
    await deleteRecord(message.id);
  };

  return (
    <div className="relative">
      <button
        onClick={handleInteraction}
        onFocus={handleInteraction}
        className="px-6 py-5 hover:bg-gray-50 w-full text-left appearance-none"
      >
        <div className="mb-2">{message.subject}</div>

        {message.attachments.map((attachment) => (
          <span
            key={attachment.dataId}
            className="text-xs px-2 py-1 bg-blue-200 rounded-sm mr-2"
          >
            {attachment.extension}
          </span>
        ))}
      </button>

      <button
        onClick={handleDelete}
        className="text-gray-300 hover:text-gray-600 appearance-none h-5 w-5 absolute top-2 right-2 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </button>
    </div>
  );
};

export default MessageListItem;
