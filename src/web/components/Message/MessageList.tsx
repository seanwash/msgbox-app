import React from "react";
import MessageListItem from "./MessageListItem";
import { Message } from "../../../types";
import { useGlobalDispatch } from "../../context/GlobalContext";
import MessageDrop from "./MessageDrop";
import { ipcRenderer } from "electron";
import { useInfiniteQuery, useQueryClient } from "react-query";

const MessageList = () => {
  const dispatch = useGlobalDispatch();
  const queryClient = useQueryClient();
  const limit = 8;

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    "messages",
    async ({ pageParam }) => {
      return await ipcRenderer.invoke("fetchAllMessages", {
        skip: pageParam,
        limit,
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const rowsToSkip = allPages.map((page) => page.rows).flat().length;
        if (rowsToSkip < lastPage.total_rows) return rowsToSkip;
      },
    }
  );

  const onSelect = (message: Message) => {
    const id = message._id as unknown;
    dispatch({ type: "selectMessage", id: id as number });
  };

  const onDelete = async (message: Message) => {
    await ipcRenderer.invoke("deleteMessage", message._id);
    dispatch({ type: "selectMessage", id: undefined });
    await queryClient.invalidateQueries("messages");
  };

  return (
    <>
      <MessageDrop />

      <div className="overflow-y-auto">
        {!isLoading && data && (
          <div className="bg-gray-100 px-6 py-4">
            {data.pages[0].total_rows} Msgs
          </div>
        )}
        <nav
          className="divide-y divide-gray-200 border-r border-gray-200"
          aria-label="Sidebar"
        >
          {!isLoading &&
            data &&
            data.pages.map((page) =>
              page.rows.map((row: any) => {
                return (
                  <MessageListItem
                    key={row.doc._id}
                    message={row.doc}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                );
              })
            )}
          {!isLoading && hasNextPage && (
            <button
              className="px-6 py-5 bg-black text-white w-full"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Load More
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

export default MessageList;
