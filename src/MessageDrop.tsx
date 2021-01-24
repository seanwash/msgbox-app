import React, { FormEvent, useState } from "react";
import MsgReader from "@npeersab/msgreader";
import { useGlobalDispatch } from "./context/GlobalContext";
import { Message } from "./types";

const MessageDrop: React.FC = (props) => {
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
          // TODO: Don't typecast here
          const msgReader = new MsgReader(buffer as ArrayBuffer);
          const fileData = msgReader.getFileData() as unknown;

          dispatch({
            type: "addMessage",
            payload: { message: fileData as Message },
          });
        };

        // TODO: Don't typecast here
        fileReader.readAsArrayBuffer(file as File);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="files" className="block">
          MSG Files
        </label>
        <input id="files" type="file" multiple onChange={onFileChange} />
      </div>

      <div className="mt-4">
        <input className="py-2 px-4" type="submit" value="View Contents" />
      </div>
    </form>
  );
};

export default MessageDrop;
