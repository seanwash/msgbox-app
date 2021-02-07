import React from "react";
import MessageListItem from "./MessageListItem";
import { Message } from "../../types";
import { useGlobalDispatch } from "../../context/GlobalContext";
import MessageDrop from "./MessageDrop";
import { ipcRenderer } from "electron";
import { useQuery, useQueryClient } from "react-query";

const MessageList = () => {
  const dispatch = useGlobalDispatch();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("messages", () => {
    return ipcRenderer.invoke("fetchAllMessages").then((results) => {
      return results.map((message: any) => ({
        ...message,
        recipients: message.recipients ? JSON.parse(message.recipients) : [],
        attachments: message.attachments ? JSON.parse(message.attachments) : [],
      }));
    });
  });

  const onSelect = (message: Message) => {
    dispatch({ type: "selectMessage", id: message.id });
  };

  const onDelete = async (message: Message) => {
    await ipcRenderer.invoke("deleteMessage", message.id);
    await queryClient.invalidateQueries("messages");
  };

  return (
    <>
      <MessageDrop />

      <div className="overflow-y-auto">
        <nav
          className="divide-y divide-gray-200 border-r border-gray-200"
          aria-label="Sidebar"
        >
          {!isLoading &&
            data.map((message: any) => {
              return (
                <MessageListItem
                  key={message.id}
                  message={message}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              );
            })}
        </nav>
      </div>
    </>
  );
};

export default MessageList;
