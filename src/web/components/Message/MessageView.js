"use strict";
exports.__esModule = true;
var react_1 = require("react");
var GlobalContext_1 = require("../../context/GlobalContext");
var MessageViewAttachment_1 = require("./MessageViewAttachment");
var electron_1 = require("electron");
var react_query_1 = require("react-query");
// TODO: Extract & refactor
function parseHeaders(headers) {
    var parsedHeaders = {};
    if (!headers) {
        return parsedHeaders;
    }
    var headerRegEx = /(.*): (.*)/g;
    var m;
    while ((m = headerRegEx.exec(headers))) {
        // todo: Pay attention! Header can be presented many times (e.g. Received). Handle it, if needed!
        parsedHeaders[m[1]] = m[2];
    }
    return parsedHeaders;
}
var MessageView = function () {
    var selectedMessage = GlobalContext_1.useGlobalState().selectedMessage;
    var _a = react_query_1.useQuery(["messages", selectedMessage], function () {
        return electron_1.ipcRenderer
            .invoke("fetchMessage", selectedMessage)
            .then(function (result) {
            result.recipients = result.recipients
                ? JSON.parse(result.recipients)
                : [];
            result.attachments = result.attachments
                ? JSON.parse(result.attachments)
                : [];
            return result;
        });
    }, {
        enabled: !!selectedMessage
    }), message = _a.data, isLoading = _a.isLoading;
    var headers = parseHeaders(message === null || message === void 0 ? void 0 : message.headers);
    var Contact = function (_a) {
        var name = _a.name, email = _a.email;
        return (<div>
      <abbr title={email}>{name}</abbr>;
    </div>);
    };
    var SectionHeading = function (_a) {
        var children = _a.children;
        return (<h3 className="text-xl font-semibold border-b-2 border-gray-200 mb-2">
      {children}
    </h3>);
    };
    return !isLoading && message ? (<div className="p-4">
      <time className="text-sm">{headers.Date}</time>
      <h2 className="text-xl font-bold">{message.subject}</h2>

      <div className="mt-8">
        <SectionHeading>From</SectionHeading>
        <Contact name={message.senderName} email={message.senderEmail}/>
      </div>

      <div className="mt-8">
        <SectionHeading>To</SectionHeading>
        {message.recipients &&
        message.recipients.map(function (recipient) { return (<Contact key={recipient.email} name={recipient.name} email={recipient.email}/>); })}
      </div>

      <div className="mt-8">
        <SectionHeading>Attachments</SectionHeading>
        {message.attachments ? (message.attachments.map(function (attachment, i) { return (<MessageViewAttachment_1["default"] key={i} attachment={attachment}/>); })) : (<div>None</div>)}
      </div>

      <div className="mt-8">
        <SectionHeading>Message</SectionHeading>
        <div className="whitespace-pre-wrap">{message.body}</div>
      </div>
    </div>) : (<div className="p-4">Select a message.</div>);
};
exports["default"] = MessageView;
