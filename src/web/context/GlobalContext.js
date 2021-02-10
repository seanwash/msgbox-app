"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.useGlobalDispatch = exports.useGlobalState = exports.GlobalContextProvider = exports.GlobalDispatchContext = exports.GlobalStateContext = void 0;
var react_1 = require("react");
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
exports.GlobalStateContext = react_1.createContext(undefined);
exports.GlobalDispatchContext = react_1.createContext(undefined);
function globalReducer(state, action) {
    switch (action.type) {
        case "selectMessage": {
            return __assign(__assign({}, state), { selectedMessage: action.id });
        }
        default: {
            throw new Error("Unhandled action type");
        }
    }
}
function GlobalContextProvider(_a) {
    var children = _a.children;
    var _b = react_1.useReducer(globalReducer, {
        selectedMessage: undefined
    }), state = _b[0], dispatch = _b[1];
    return (<exports.GlobalStateContext.Provider value={state}>
      <exports.GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </exports.GlobalDispatchContext.Provider>
    </exports.GlobalStateContext.Provider>);
}
exports.GlobalContextProvider = GlobalContextProvider;
function useGlobalState() {
    var context = react_1.useContext(exports.GlobalStateContext);
    if (context === undefined) {
        throw new Error("useGlobalState must be used within a CountProvider");
    }
    return context;
}
exports.useGlobalState = useGlobalState;
function useGlobalDispatch() {
    var context = react_1.useContext(exports.GlobalDispatchContext);
    if (context === undefined) {
        throw new Error("useGlobalDispatch must be used within a CountProvider");
    }
    return context;
}
exports.useGlobalDispatch = useGlobalDispatch;
