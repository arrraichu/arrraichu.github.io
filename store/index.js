import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

const reducers = combineReducers({

});

const middleware = [thunk];

const store = createStore(reducers, applyMiddleware(...middleware));

export const getStore = () => store;
