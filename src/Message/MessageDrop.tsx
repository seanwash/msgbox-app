import React, { FormEvent, useState } from "react";
import MsgReader from "@npeersab/msgreader";
import { useGlobalDispatch } from "../context/GlobalContext";
import { Message } from "../types";

const MessageDrop: React.FC = () => {
  const [fileList, setFileList] = useState<FileList>();
  const dispatch = useGlobalDispatch();

  const onFileChange = (e: FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (files) {
      setFileList(files);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fileList?.length) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);

        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          const buffer = e.target?.result;
          const msgReader = new MsgReader(buffer as ArrayBuffer);
          const fileData = (msgReader.getFileData() as unknown) as Message;

          dispatch({
            type: "addMessage",
            // We need to keep track of the reader here so that we can use it later to download any attachments.
            payload: { message: { ...fileData, reader: msgReader } },
          });
        };

        fileReader.readAsArrayBuffer(file as File);
      }
    }
  };

  return (
    <form className="bg-blue-100 p-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor="files" className="sr-only">
          MSG Files
        </label>
        <input
          className="w-full"
          id="files"
          type="file"
          multiple
          onChange={onFileChange}
        />
      </div>

      <div className="mt-4">
        <input
          className="block w-full py-2 px-4 rounded-sm cursor-pointer bg-blue-800 text-white"
          type="submit"
          value="View Contents"
        />
      </div>
    </form>
  );
};

export default MessageDrop;
