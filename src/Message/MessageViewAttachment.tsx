import React from "react";
import { Attachment } from "../types";
// TODO: Is there an alternative here?
const mime = require("mime-types");

type Props = {
  attachment: Attachment;
};

const MessageViewAttachment: React.FC<Props> = ({ attachment }) => {
  const { file } = attachment;
  const fileUrl = URL.createObjectURL(
    new File([file.content], file.fileName, {
      type: mime.lookup(attachment.extension) || "application/octet-stream",
    })
  );

  return (
    <div>
      <a
        className="text-blue-500 underline"
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
      >
        {attachment.name}
      </a>
    </div>
  );
};

export default MessageViewAttachment;
