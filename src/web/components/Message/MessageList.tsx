import React, { FormEvent, useEffect, useRef, useState } from "react";
import MessageListItem from "./MessageListItem";
import { Message } from "../../../types";
import { useGlobalDispatch, useGlobalState } from "../../context/GlobalContext";
import { ipcRenderer } from "electron";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useIntersection } from "react-use";

const MessageList = () => {
  const dispatch = useGlobalDispatch();
  const { selectedMessageId } = useGlobalState();
  const queryClient = useQueryClient();
  const limit = 20;
  const loadMoreRef = useRef(null);
  const loadMoreIntersection = useIntersection(loadMoreRef, {});
  const [search, setSearch] = useState<string>("");

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["fetchAllMessages", search],
    async ({ pageParam }) => {
      return await ipcRenderer.invoke("fetchAllMessages", {
        skip: pageParam,
        limit,
        search,
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const rowsToSkip = allPages.map((page) => page.rows).flat().length;
        if (rowsToSkip < lastPage.total_rows) return rowsToSkip;
      },
    }
  );

  useEffect(() => {
    loadMoreIntersection?.isIntersecting && fetchNextPage();
  }, [fetchNextPage, loadMoreIntersection]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    queryClient.invalidateQueries(["fetchAllMessages", search]);
  };

  const onSelect = (message: Message) => {
    const id = message._id as unknown;
    dispatch({ type: "selectMessage", id: id as string });
  };

  const onDelete = async (message: Message) => {
    await ipcRenderer.invoke("deleteMessage", message._id);
    dispatch({ type: "selectMessage", id: undefined });
    await queryClient.invalidateQueries("fetchAllMessages");
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <input
          className="w-full px-6 py-4"
          type="search"
          placeholder="Search"
          onChange={(event) => setSearch(event.currentTarget.value)}
          value={search}
        />
      </form>

      {!isLoading && data && (
        <div className="bg-gray-100 px-6 py-4">
          {data.pages[0].total_rows} Messages
        </div>
      )}

      <div className="overflow-y-auto">
        <nav className="divide-y divide-gray-200" aria-label="Sidebar">
          {!isLoading &&
            data &&
            data.pages.map((page) =>
              page.rows.map((row: any) => {
                return (
                  <MessageListItem
                    selected={row.doc._id === selectedMessageId}
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
              ref={loadMoreRef}
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
