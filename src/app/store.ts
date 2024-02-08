import notesReducer from "@/redux/notes/notesSlice";
import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./middleware";

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
