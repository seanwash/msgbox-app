import React from "react";
import { useGlobalState } from "./context/GlobalContext";
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

  return selectedMessage ? (
    <div className="w-3/4 p-4 overflow-auto">
      <time className="text-sm">{headers.Date}</time>
      <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">From</h3>
        <Contact
          name={selectedMessage.senderName}
          email={selectedMessage.senderEmail}
        />
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">To</h3>
        {selectedMessage.recipients.map((recipient) => (
          <Contact
            key={recipient.email}
            name={recipient.name}
            email={recipient.email}
          />
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Message</h3>
        <div className="whitespace-pre-wrap">{selectedMessage.body}</div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Attachments</h3>
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
    </div>
  ) : (
    <div>Select a message.</div>
  );
};

export default MessageView;
