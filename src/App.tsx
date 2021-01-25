import React from "react";
import { GlobalContextProvider } from "./context/GlobalContext";
import MessageBox from "./Message/MessageBox";

function App() {
  return (
    <GlobalContextProvider>
      <div className="App h-full">
        <MessageBox />
      </div>
    </GlobalContextProvider>
  );
}

export default App;
