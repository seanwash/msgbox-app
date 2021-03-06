import React, { createContext, ReactNode, useContext, useReducer } from "react";

type Action = { type: "selectMessage"; id?: string };

type Dispatch = (action: Action) => void;

type State = {
  selectedMessageId: string | undefined;
};

type ProviderProps = { children: ReactNode };

const SELECTED_MESSAGE_ID_LOCAL_STORAGE_KEY = "MsgBoxSelectedMessageId";

// https://kentcdodds.com/blog/how-to-use-react-context-effectively
export const GlobalStateContext = createContext<State | undefined>(undefined);
export const GlobalDispatchContext = createContext<Dispatch | undefined>(
  undefined
);

function globalReducer(state: State, action: Action) {
  switch (action.type) {
    case "selectMessage": {
      if (action?.id) {
        localStorage.setItem(SELECTED_MESSAGE_ID_LOCAL_STORAGE_KEY, action.id);
      }

      return { ...state, selectedMessageId: action.id };
    }

    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

function GlobalContextProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(globalReducer, {
    selectedMessageId:
      localStorage.getItem(SELECTED_MESSAGE_ID_LOCAL_STORAGE_KEY) || undefined,
  });

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a CountProvider");
  }
  return context;
}

function useGlobalDispatch() {
  const context = useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error("useGlobalDispatch must be used within a CountProvider");
  }
  return context;
}

export { GlobalContextProvider, useGlobalState, useGlobalDispatch };
