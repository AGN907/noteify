import foldersSlice from "@/redux/folders/foldersSlice";
import notesReducer from "@/redux/notes/notesSlice";
import tagsSlice from "@/redux/tags/tagsSlice";
import {
  ListenerMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
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
  middleware?: ListenerMiddleware[];
}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware(getDefaultMiddleware) {
      return middleware
        ? getDefaultMiddleware().prepend(middleware)
        : getDefaultMiddleware();
    },
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export default setupStore({ middleware: [listenerMiddleware.middleware] });
