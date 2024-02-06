import type { Item, Note } from "@/components/ListItem/types";
import {
  Dispatch,
  ThunkDispatch,
  UnknownAction,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Content } from "@tiptap/react";
import { enableMapSet } from "immer";
import { v4 as uuid } from "uuid";

enableMapSet();

export type NotesDispatch = ThunkDispatch<
  {
    notes: initialState;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

export type initialState = {
  notes: Map<string, Item<Note>>;
  selectedNoteId: string | null;
};

const initialState: initialState = {
  notes: new Map(),
  selectedNoteId: null,
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    createNote: (state) => {
      const id = uuid();
      const currentTimestamp = Date.now();

      state.notes.set(id, {
        id,
        type: "note",
        title: `New Note`,
        content: `<h1>New Note</h1>`,
        isPinned: false,
        isFavourite: false,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
        readonly: false,
        tags: [],
      });

      state.selectedNoteId = id;
    },
    updateNote: (
      state,
      action: PayloadAction<{ title: string; content: Content }>,
    ) => {
      if (!state.selectedNoteId) return;

      const note = state.notes.get(state.selectedNoteId);

      if (note) {
        note.title = action.payload.title ?? note.title;
        note.content = action.payload.content;
        note.updatedAt = Date.now();
      }
    },

    selectNote: (state, action: PayloadAction<string>) => {
      state.selectedNoteId = action.payload;
    },

    pinNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.get(action.payload);

      if (note) {
        note.isPinned = !note.isPinned;
        note.updatedAt = Date.now();
      }
    },

    favouriteNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.get(action.payload);

      if (note) {
        note.isFavourite = !note.isFavourite;
        note.updatedAt = Date.now();
      }
    },
    duplicateNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.get(action.payload);

      const id = uuid();
      const currentTimestamp = Date.now();

      if (note) {
        state.notes.set(id, {
          ...note,
          id,
          title: `Copy of ${note.title}`,
          content: `Copy of ${note.content}`,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        });
      }
    },
    moveNoteToTrash: (state, action: PayloadAction<string>) => {
      const note = state.notes.get(action.payload);
      if (note) {
        note.type = "trash";
        note.readonly = true;
      }
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = null;
      }
    },
    previewNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.get(action.payload);

      if (note) {
        note.readonly = !note.readonly;
      }
    },
    restoreNoteFromTrash: (state, action: PayloadAction<string>) => {
      const note = state.notes.get(action.payload);
      if (note && note.type === "trash") {
        note.type = "note";
        note.readonly = false;
      }
    },
    permaDeleteNote: (state, action: PayloadAction<string>) => {
      state.notes.delete(action.payload);
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = null;
      }
    },
  },
});

export const {
  createNote,
  selectNote,
  updateNote,
  pinNote,
  favouriteNote,
  duplicateNote,
  moveNoteToTrash,
  previewNote,
  restoreNoteFromTrash,
  permaDeleteNote,
} = notesSlice.actions;

export default notesSlice.reducer;
