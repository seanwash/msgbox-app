import React from "react";
import MessageList from "./MessageList";
import MessageView from "./MessageView";

const MessageBox: React.FC = (props) => (
  <div className="flex h-full">
    <MessageList />
    <MessageView />
  </div>
);

export default MessageBox;
