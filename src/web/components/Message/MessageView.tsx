import React from "react";
import { useGlobalState } from "../../context/GlobalContext";
import MessageViewAttachment from "./MessageViewAttachment";
import { ipcRenderer } from "electron";
import { useQuery } from "react-query";

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

  const { data: message, isLoading } = useQuery(
    ["messages", selectedMessage],
    () => {
      return ipcRenderer
        .invoke("fetchMessage", selectedMessage)
        .then((result) => {
          result.recipients = result.recipients
            ? JSON.parse(result.recipients)
            : [];
          result.attachments = result.attachments
            ? JSON.parse(result.attachments)
            : [];

          return result;
        });
    },
    {
      enabled: !!selectedMessage,
    }
  );

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

  return !isLoading && message ? (
    <div className="p-4">
      <time className="text-sm">{headers.Date}</time>
      <h2 className="text-xl font-bold">{message.subject}</h2>

      <div className="mt-8">
        <SectionHeading>From</SectionHeading>
        <Contact name={message.senderName} email={message.senderEmail} />
      </div>

      <div className="mt-8">
        <SectionHeading>To</SectionHeading>
        {message.recipients &&
          message.recipients.map((recipient: any) => (
            <Contact
              key={recipient.email}
              name={recipient.name}
              email={recipient.email}
            />
          ))}
      </div>

      <div className="mt-8">
        <SectionHeading>Attachments</SectionHeading>
        {message.attachments ? (
          message.attachments.map((attachment: any, i: number) => (
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
    <div className="p-4">Select a message.</div>
  );
};

export default MessageView;
