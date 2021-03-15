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
          result.recipients = result.recipients ? result.recipients : [];
          result.attachments = result.attachments ? result.attachments : [];
          return result;
        });
    },
    {
      enabled: !!selectedMessage,
    }
  );

  const headers = parseHeaders(message?.headers);

  const messageDate = new Date(headers.Date).toDateString();

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
    <div className="m-4 bg-white overflow-hidden rounded-sm shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold">{message.subject}</h2>
        <time className="block text-sm mt-2 text-gray-500">{messageDate}</time>
      </div>

      <div className="p-6 pt-0">
        <SectionHeading>From</SectionHeading>
        <Contact name={message.senderName} email={message.senderEmail} />
      </div>

      <div className="p-6 pt-0">
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

      <div className="p-6 pt-0">
        <SectionHeading>Attachments</SectionHeading>
        {message?.attachments?.length ? (
          message.attachments.map((attachment: any, i: number) => (
            <MessageViewAttachment key={i} attachment={attachment} />
          ))
        ) : (
          <div>No Attachments</div>
        )}
      </div>

      <div className="p-6 bg-gray-50">
        <SectionHeading>Message</SectionHeading>
        <div className="whitespace-pre-wrap">{message.body}</div>
      </div>
    </div>
  ) : (
    <div className="p-4">Select a message.</div>
  );
};

export default MessageView;
