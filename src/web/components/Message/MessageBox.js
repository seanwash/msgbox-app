"use strict";
exports.__esModule = true;
var react_1 = require("react");
var MessageList_1 = require("./MessageList");
var MessageView_1 = require("./MessageView");
var MessageBox = function () {
    return (<div className="flex h-full">
      <div className="w-1/4 flex flex-col overflow-auto relative">
        <MessageList_1["default"] />
      </div>

      <div className="w-3/4 overflow-auto">
        <MessageView_1["default"] />
      </div>
    </div>);
};
exports["default"] = MessageBox;
