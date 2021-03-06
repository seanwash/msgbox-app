import React from "react";
import { shell } from "electron";

import { Attachment } from "../../../types";

type Props = {
  attachment: Attachment;
};

const MessageViewAttachment: React.FC<Props> = ({ attachment }) => {
  const handleClick = () => {
    shell.openPath(attachment.path);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="text-blue-500 underline focus:outline-none focus:ring-2 ring-blue-500"
      >
        {attachment.fileName}
      </button>
    </div>
  );
};

export default MessageViewAttachment;
