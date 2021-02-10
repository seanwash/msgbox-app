"use strict";
exports.__esModule = true;
var react_1 = require("react");
// TODO: Is there an alternative here?
var mime = require("mime-types");
var MessageViewAttachment = function (_a) {
    var attachment = _a.attachment;
    var file = attachment.file;
    var fileUrl = URL.createObjectURL(new File([file.content], file.fileName, {
        type: mime.lookup(attachment.extension) || "application/octet-stream"
    }));
    return (<div>
      <a className="text-blue-500 underline" href={fileUrl} target="_blank" rel="noreferrer">
        {attachment.name}
      </a>
    </div>);
};
exports["default"] = MessageViewAttachment;
