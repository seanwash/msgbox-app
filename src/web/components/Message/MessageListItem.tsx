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
        className="px-6 py-5 hover:bg-gray-50 w-full text-left appearance-none"
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
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </button>
    </div>
  );
};

export default MessageListItem;
