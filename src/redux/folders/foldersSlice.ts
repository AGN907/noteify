import type { Folder, Item } from "@/components/ListItem/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

type initialState = {
  folders: Record<string, Item<Folder>>;
  isFoldersLoading: boolean;
};

const initialState: initialState = {
  folders: {},
  isFoldersLoading: true,
};

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    addFolder: (state, action: PayloadAction<{ name: string }>) => {
      const id = uuid();
      const { name } = action.payload;
      state.folders[id] = {
        id,
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: 0,
        type: "folder",
      };
    },
    updateFolder: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      const { id, name } = action.payload;
      state.folders[id].name = name;

      state.folders[id].updatedAt = Date.now();
    },
    removeFolder: (state, action) => {
      delete state.folders[action.payload];
    },
  },
});

export const { addFolder, updateFolder, removeFolder } = foldersSlice.actions;

export default foldersSlice.reducer;
