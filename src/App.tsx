import React from "react";
import { GlobalContextProvider } from "./context/GlobalContext";
import MessageBox from "./Message/MessageBox";

import { DBConfig } from "./db-config";
import { initDB } from "react-indexed-db";

initDB(DBConfig);

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
