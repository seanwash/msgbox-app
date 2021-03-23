import React, { useState } from "react";
import { useDrop } from "react-use";
import MsgReader from "@npeersab/msgreader";
import { Message } from "../../types";
import { useMutation, useQueryClient } from "react-query";
import { ipcRenderer } from "electron";

const FileDrop: React.FC = ({ children }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(({ message }: any) => {
    return ipcRenderer.invoke("createMessage", message);
  });

  const onDrop = (files: File[]) => {
    let importedFileCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // TODO: Replace with newer Blob API that is promise based.
      const fileReader = new FileReader();

      // TODO: Handle errors, test with INVALID message file
      fileReader.onload = async (e) => {
        const buffer = e.target?.result;
        const msgReader = new MsgReader(buffer as ArrayBuffer);
        const fileData = (msgReader.getFileData() as unknown) as Message;

        // @ts-ignore
        if (fileData.error) {
          // @ts-ignore
          console.log("-----", "import error", fileData.error);
          return;
        }

        const attachments = fileData.attachments.map((attachment, index) => {
          // Returns fileName & content
          const file = msgReader.getAttachment(index);
          return { ...attachment, file };
        });

        mutation.mutate({
          message: {
            ...fileData,
            recipients: fileData.recipients,
            attachments: attachments,
            read: false,
          },
        });
      };

      // eslint-disable-next-line no-loop-func
      fileReader.onloadend = () => {
        if (importedFileCount < files.length - 1) {
          importedFileCount += 1;
        } else {
          queryClient.invalidateQueries("messages");
        }
      };

      fileReader.readAsArrayBuffer(file as File);
    }
  };

  useDrop({
    onFiles: onDrop,
  });

  return <>{children}</>;
};

export default FileDrop;
