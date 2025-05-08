// store.js - Redux store configuration
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
