import foldersSlice from "@/redux/folders/foldersSlice";
import notesReducer from "@/redux/notes/notesSlice";
import tagsSlice from "@/redux/tags/tagsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./middleware";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    folders: foldersSlice,
    tags: tagsSlice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
