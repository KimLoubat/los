import { createStore, applyMiddleware, combineReducers } from "redux";

// Logger with default options
import logger from "redux-logger";

import reducer from "./reducer";

// Si besoin de plusieurs reducers on peut creer un rootReducer et le passer en param de configureStore
// import listReducer from '/reducer'
// const rootReducer = combineReducers({
//     list: listReducer,
// })

export default function configureStore(initialState){
    const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    //const store = createStore(reducer, initialState, applyMiddleware(logger));
    return store;
}