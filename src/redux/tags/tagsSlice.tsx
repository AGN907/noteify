import { startAppListening } from "@/app/middleware";
import type { Item, Tag } from "@/components/ListItem/types";
import storage from "@/lib/db";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

startAppListening({
  predicate: (action) => {
    if (action.type === "tags/loadTags.fulfilled") {
      return false;
    }

    if (action.type.startsWith("tags/")) {
      return true;
    }

    return false;
  },
  effect: async (action, api) => {
    if (action.type === "tags/removeTag") {
      await storage.db.remove(action.payload as string);
      return;
    }

    const tagsState: Item<Tag>[] = api.getState().tags.tags;

    await storage.db.set(
      "tags",
      tagsState.map((tag) => tag.id),
    );

    await storage.db.setAll(tagsState);
  },
});

type initialState = {
  tags: Item<Tag>[];
};

export const loadTags = createAsyncThunk("tags/loadTags", async () => {
  const tagsKey = await storage.db.get<string[]>("tags");
  if (!tagsKey) return [];

  const tags = await storage.db.getAll<Item<Tag>>(tagsKey);
  if (tags) return tags;

  return [];
});

const initialState: initialState = {
  tags: [],
};

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<{ id?: string; name: string }>) => {
      const { name } = action.payload;
      const id = action.payload.id ?? uuid();

      state.tags.push({
        id,
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: 0,
        type: "tag",
      });
    },
    updateTag: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;

      const tag = state.tags.find((tag) => tag.id === id);

      if (tag) {
        tag.name = name;
        tag.updatedAt = Date.now();
      }
    },

    removeTag: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      state.tags = state.tags.filter((tag) => tag.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTags.fulfilled, (state, action) => {
      state.tags = action.payload;
    });
  },
});

export const { addTag, updateTag, removeTag } = tagsSlice.actions;

export default tagsSlice.reducer;
