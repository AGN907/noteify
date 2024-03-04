import foldersSlice from "@/redux/folders/foldersSlice";
import notesReducer from "@/redux/notes/notesSlice";
import tagsSlice from "@/redux/tags/tagsSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./middleware";

const rootReducer = combineReducers({
  notes: notesReducer,
  folders: foldersSlice,
  tags: tagsSlice,
});

export const setupStore = ({
  preloadedState,
  middleware,
}: {
  preloadedState?: Partial<RootState>;
  middleware?: boolean;
}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware(getDefaultMiddleware) {
      if (!middleware) return getDefaultMiddleware();
      return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
    },
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export default setupStore({});
