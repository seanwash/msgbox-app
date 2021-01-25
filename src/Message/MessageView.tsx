import React, { useEffect, useState } from "react";
import { useGlobalState } from "../context/GlobalContext";
import MessageViewAttachment from "./MessageViewAttachment";
import { useIndexedDB } from "react-indexed-db";
import { Message } from "../types";

// TODO: Extract & refactor
function parseHeaders(headers: any) {
  const parsedHeaders: any = {};

  if (!headers) {
    return parsedHeaders;
  }

  const headerRegEx = /(.*): (.*)/g;

  let m;
  while ((m = headerRegEx.exec(headers))) {
    // todo: Pay attention! Header can be presented many times (e.g. Received). Handle it, if needed!
    parsedHeaders[m[1]] = m[2];
  }

  return parsedHeaders;
}

const MessageView: React.FC = () => {
  const { selectedMessage } = useGlobalState();
  const { getByID } = useIndexedDB("messages");
  const [message, setMessage] = useState<Message | undefined>();

  useEffect(() => {
    if (selectedMessage === undefined) return;

    getByID(selectedMessage).then((messageFromDb) => {
      setMessage(messageFromDb);
    });
  }, [selectedMessage, getByID]);

  const headers = parseHeaders(message?.headers);

  const Contact = ({ name, email }: { name: string; email: string }) => (
    <div>
      <abbr title={email}>{name}</abbr>;
    </div>
  );

  const SectionHeading: React.FC = ({ children }) => (
    <h3 className="text-xl font-semibold border-b-2 border-gray-200 mb-2">
      {children}
    </h3>
  );

  return message ? (
    <div className="p-4">
      <time className="text-sm">{headers.Date}</time>
      <h2 className="text-xl font-bold">{message.subject}</h2>

      <div className="mt-8">
        <SectionHeading>From</SectionHeading>
        <Contact name={message.senderName} email={message.senderEmail} />
      </div>

      <div className="mt-8">
        <SectionHeading>To</SectionHeading>
        {message.recipients.map((recipient) => (
          <Contact
            key={recipient.email}
            name={recipient.name}
            email={recipient.email}
          />
        ))}
      </div>

      <div className="mt-8">
        <SectionHeading>Attachments</SectionHeading>
        {message.attachments.length ? (
          message.attachments.map((attachment, i) => (
            <MessageViewAttachment key={i} attachment={attachment} />
          ))
        ) : (
          <div>None</div>
        )}
      </div>

      <div className="mt-8">
        <SectionHeading>Message</SectionHeading>
        <div className="whitespace-pre-wrap">{message.body}</div>
      </div>
    </div>
  ) : (
    <div>Select a message.</div>
  );
};

export default MessageView;
