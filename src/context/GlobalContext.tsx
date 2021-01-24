import { createContext, ReactNode, useContext, useReducer } from "react";
import { Message } from "../types";

type Action =
  | { type: "setMessages"; payload: { messages: Message[] } }
  | { type: "addMessage"; payload: { message: Message } }
  | { type: "selectMessage"; payload: { message: Message } };

type Dispatch = (action: Action) => void;

// TODO: SelectedMessage should just store an ID.
type State = { messages: Message[]; selectedMessage: Message | undefined };

type ProviderProps = { children: ReactNode };

// https://kentcdodds.com/blog/how-to-use-react-context-effectively
export const GlobalStateContext = createContext<State | undefined>(undefined);
export const GlobalDispatchContext = createContext<Dispatch | undefined>(
  undefined
);

const defaultReducerState = {
  messages: [],
  selectedMessage: undefined,
};

function globalReducer(state: State, action: Action) {
  switch (action.type) {
    case "setMessages": {
      return { ...state, messages: action.payload.messages };
    }

    case "addMessage": {
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    }

    case "selectMessage": {
      return {
        ...state,
        selectedMessage: action.payload.message,
      };
    }

    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

function GlobalContextProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(globalReducer, defaultReducerState);

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
