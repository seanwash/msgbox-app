import React from "react";
import { Message, Attachment } from "../../../types";

type Props = {
  message: Message;
  onSelect: (message: Message) => void;
  onDelete: (message: Message) => void;
};

const MessageListItem: React.FC<Props> = ({ message, onSelect, onDelete }) => {
  const onInteraction = () => onSelect(message);
  const handleDelete = () => onDelete(message);
  const attachments: Attachment[] = message.attachments;

  return (
    <div className="relative">
      <button
        onClick={onInteraction}
        onFocus={onInteraction}
        className="pl-6 pr-10 py-5 bg-white hover:bg-gray-50 w-full text-left appearance-none"
      >
        <div className="mb-2">{message.subject}</div>

        {attachments.map((attachment) => (
          <span
            key={attachment.fileName}
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default MessageListItem;
