import React, { FormEvent, useState } from "react";
import MsgReader from "@npeersab/msgreader";
import { Message } from "../types";
import { useIndexedDB } from "react-indexed-db";

type Props = {
  onImport: () => void;
};

const MessageDrop: React.FC<Props> = ({ onImport }) => {
  const [fileList, setFileList] = useState<FileList>();
  const [importing, setImporting] = useState<boolean>(false);
  const { add } = useIndexedDB("messages");

  const onFileChange = (e: FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (files) {
      setFileList(files);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImporting(true);

    if (fileList?.length) {
      let importedFileCount = 0;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);

        // TODO: Replace with newer Blob API that is promise based.
        const fileReader = new FileReader();

        // TODO: Handle errors, test with INVALID message file
        fileReader.onload = async (e) => {
          const buffer = e.target?.result;
          const msgReader = new MsgReader(buffer as ArrayBuffer);
          const fileData = (msgReader.getFileData() as unknown) as Message;

          const attachments = fileData.attachments.map((attachment, index) => {
            const file = msgReader.getAttachment(index);
            return { ...attachment, file };
          });

          await add({ ...fileData, attachments, reader: msgReader });
        };

        fileReader.onloadend = (e) => {
          if (importedFileCount < fileList.length - 1) {
            importedFileCount += 1;
          } else {
            onImport();
            setImporting(false);
          }
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
          disabled={importing}
          className="block w-full py-2 px-4 rounded-sm cursor-pointer bg-blue-800 text-white disabled:opacity-50"
          type="submit"
          value="View Contents"
        />
      </div>
    </form>
  );
};

export default MessageDrop;
