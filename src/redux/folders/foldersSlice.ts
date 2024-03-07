import { startAppListening } from "@/app/middleware";
import type { ExtendedItem } from "@/components/ListItem/types";
import storage from "@/lib/db";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

startAppListening({
  predicate: (action) => {
    if (action.type === "folders/loadFolders.fulfilled") {
      return false;
    }

    if (action.type.startsWith("folders/")) {
      return true;
    }

    return false;
  },
  effect: async (action, api) => {
    if (action.type === "folders/removeFolder") {
      await storage.db.remove(action.payload as string);
    }

    const foldersState: ExtendedItem<"folder">[] =
      api.getState().folders.folders;

    storage.db.set(
      "folders",
      foldersState.map((f) => f.id),
    );

    const folders = foldersState;

    await Promise.all(
      folders.map((folder) => storage.db.set(folder.id, folder)),
    );
  },
});

export const loadFolders = createAsyncThunk("folders/loadFolders", async () => {
  const foldersIds = (await storage.db.get<string[]>("folders")) ?? [];
  const folders = await Promise.all(
    foldersIds.map((id) => storage.db.get<ExtendedItem<"folder">>(id)),
  );

  return folders.reduce((acc, folder) => {
    if (folder) {
      acc.push(folder);
    }
    return acc;
  }, [] as ExtendedItem<"folder">[]);
});

type initialState = {
  folders: ExtendedItem<"folder">[];
  isFoldersLoading: boolean;
};

const initialState: initialState = {
  folders: [],
  isFoldersLoading: true,
};

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    addFolder: (state, action: PayloadAction<{ name: string }>) => {
      const id = uuid();
      const { name } = action.payload;

      state.folders.push({
        id,
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: 0,
        type: "folder",
      });
    },
    updateFolder: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      const { id, name } = action.payload;
      const folderIndex = state.folders.findIndex((f) => f.id === id);

      if (folderIndex !== -1) {
        state.folders[folderIndex].name = name;
        state.folders[folderIndex].updatedAt = Date.now();
      }
    },
    removeFolder: (state, action) => {
      state.folders = state.folders.filter((f) => f.id !== action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(loadFolders.fulfilled, (state, action) => {
      state.folders = action.payload;
      state.isFoldersLoading = false;
    });
  },
});

export const { addFolder, updateFolder, removeFolder } = foldersSlice.actions;

export default foldersSlice.reducer;
