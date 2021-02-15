import React from "react";
import { GlobalContextProvider } from "../../context/GlobalContext";
import MessageBox from "../Message/MessageBox";

import { FileDropProvider } from "../../Providers";
// TODO: Extract into a provider dir
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <FileDropProvider>
          <div className="App h-full">
            <MessageBox />
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </div>
        </FileDropProvider>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
};

export default App;
