import React from "react";
import MessageDrop from "./MessageDrop";
import { GlobalContextProvider } from "./context/GlobalContext";
import MessageBox from "./MessageBox";

function App() {
  return (
    <GlobalContextProvider>
      <div className="App h-full">
        <MessageDrop />
        <MessageBox />
      </div>
    </GlobalContextProvider>
  );
}

export default App;
