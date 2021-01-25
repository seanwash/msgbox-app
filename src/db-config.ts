export const DBConfig = {
  name: "MsgBox",
  version: 1,
  objectStoresMeta: [
    {
      store: "messages",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "reader", keypath: "reader", options: { unique: false } },
        {
          name: "attachments",
          keypath: "attachments",
          options: { unique: false },
        },
        {
          name: "recipients",
          keypath: "recipients",
          options: { unique: false },
        },
        { name: "subject", keypath: "subject", options: { unique: false } },
        { name: "headers", keypath: "headers", options: { unique: false } },
        { name: "body", keypath: "body", options: { unique: false } },
        {
          name: "senderName",
          keypath: "senderName",
          options: { unique: false },
        },
        {
          name: "senderEmail",
          keypath: "senderEmail",
          options: { unique: false },
        },
        {
          name: "compressedRtf",
          keypath: "compressedRtf",
          options: { unique: false },
        },
      ],
    },
  ],
};
