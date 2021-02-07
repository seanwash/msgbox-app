import React from "react";
import { GlobalContextProvider } from "../../context/GlobalContext";
import MessageBox from "../Message/MessageBox";

// TODO: Extract into a provider dir
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <div className="App h-full">
          <MessageBox />
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </div>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
}

export default App;
