"use strict";
exports.__esModule = true;
var react_1 = require("react");
var GlobalContext_1 = require("../../context/GlobalContext");
var MessageBox_1 = require("../Message/MessageBox");
// TODO: Extract into a provider dir
var react_query_1 = require("react-query");
var devtools_1 = require("react-query/devtools");
var queryClient = new react_query_1.QueryClient();
function App() {
    return (<react_query_1.QueryClientProvider client={queryClient}>
      <GlobalContext_1.GlobalContextProvider>
        <div className="App h-full">
          <MessageBox_1["default"] />
          <devtools_1.ReactQueryDevtools initialIsOpen={false} position="bottom-right"/>
        </div>
      </GlobalContext_1.GlobalContextProvider>
    </react_query_1.QueryClientProvider>);
}
exports["default"] = App;
