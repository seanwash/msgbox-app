import React from "react";
import { useGlobalState } from "../context/GlobalContext";
import MessageViewAttachment from "./MessageViewAttachment";

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
  const headers = parseHeaders(selectedMessage?.headers);

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

  return selectedMessage ? (
    <div className="p-4">
      <time className="text-sm">{headers.Date}</time>
      <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>

      <div className="mt-8">
        <SectionHeading>From</SectionHeading>
        <Contact
          name={selectedMessage.senderName}
          email={selectedMessage.senderEmail}
        />
      </div>

      <div className="mt-8">
        <SectionHeading>To</SectionHeading>
        {selectedMessage.recipients.map((recipient) => (
          <Contact
            key={recipient.email}
            name={recipient.name}
            email={recipient.email}
          />
        ))}
      </div>

      <div className="mt-8">
        <SectionHeading>Attachments</SectionHeading>
        {selectedMessage.attachments.length ? (
          selectedMessage.attachments.map((attachment, i) => (
            <MessageViewAttachment
              key={i}
              message={selectedMessage}
              attachment={attachment}
              index={i}
            />
          ))
        ) : (
          <div>None</div>
        )}
      </div>

      <div className="mt-8">
        <SectionHeading>Message</SectionHeading>
        <div className="whitespace-pre-wrap">{selectedMessage.body}</div>
      </div>
    </div>
  ) : (
    <div>Select a message.</div>
  );
};

export default MessageView;
