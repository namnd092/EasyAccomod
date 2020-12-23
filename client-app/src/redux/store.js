import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import { applyMiddleware } from 'redux';

// const store = createStore(rootReducer);
const store = configureStore({
    reducer: rootReducer,
});

export default store;
