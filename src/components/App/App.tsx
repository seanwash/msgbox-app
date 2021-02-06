import React from "react";
import { GlobalContextProvider } from "../../context/GlobalContext";
import MessageBox from "../Message/MessageBox";

import { Config } from "../../db/config";
import { initDB } from "react-indexed-db";

initDB(Config);

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
