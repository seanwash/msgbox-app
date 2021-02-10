import React from "react";
import MessageList from "./MessageList";
import MessageView from "./MessageView";

const MessageBox: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="w-1/4 flex flex-col overflow-auto relative">
        <MessageList />
      </div>

      <div className="w-3/4 overflow-auto">
        <MessageView />
      </div>
    </div>
  );
};

export default MessageBox;
