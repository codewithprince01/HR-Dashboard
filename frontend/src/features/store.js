// store.js
import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from './candidateSlice';


export const store = configureStore({
  reducer: {

    candidates: candidateReducer,
  },
});