import React from "react";
import MessageList from "./MessageList";
import MessageView from "./MessageView";
import MessageDrop from "./MessageDrop";

const MessageBox: React.FC = () => (
  <div className="flex h-full">
    <div className="w-1/4 flex flex-col overflow-auto relative">
      <MessageDrop />
      <div className="overflow-y-auto">
        <MessageList />
      </div>
    </div>

    <div className="w-3/4 overflow-auto">
      <MessageView />
    </div>
  </div>
);

export default MessageBox;
