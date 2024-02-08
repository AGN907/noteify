import { startAppListening } from "@/app/middleware";
import type { Item, Note } from "@/components/ListItem/types";
import storage from "@/lib/db";
import {
  Dispatch,
  ThunkDispatch,
  UnknownAction,
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Content } from "@tiptap/react";
import { v4 as uuid } from "uuid";

startAppListening({
  predicate: (action) => {
    if (action.type === "notes/loadNotes.fulfilled") {
      return false;
    }

    if (action.type.startsWith("notes/")) {
      return true;
    }

    return false;
  },
  effect: async (_, api) => {
    const notesState: Record<string, Item<Note>> = api.getState().notes.notes;
    storage.db.set("notes", Object.keys(notesState));

    const notes = Object.values(notesState);
    await Promise.all(notes.map((note) => storage.db.set(note.id, note)));
  },
});

export type NotesDispatch = ThunkDispatch<
  {
    notes: initialState;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

export type initialState = {
  notes: Record<string, Item<Note>>;
  selectedNoteId: string | null;
  isNotesLoading: boolean;
};

const initialState: initialState = {
  notes: {},
  selectedNoteId: null,
  isNotesLoading: true,
};

export const loadNotes = createAsyncThunk("notes/loadNotes", async () => {
  const notesIds = (await storage.db.get<string[]>("notes")) ?? [];
  const notes = await Promise.all(
    notesIds.map((id) => storage.db.get<Item<Note>>(id)),
  );

  return notes.reduce(
    (acc, note) => {
      if (note) {
        acc[note.id] = note;
      }
      return acc;
    },
    {} as Record<string, Item<Note>>,
  );
});

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    createNote: (state) => {
      const note = {
        id: uuid(),
        title: "New Note",
        content: "<h1>New Note</h1>",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: 0,
        type: "note",
        isFavourite: false,
        isPinned: false,
        readonly: false,
      };

      state.notes[note.id] = note;

      state.selectedNoteId = note.id;
    },
    updateNote: (
      state,
      action: PayloadAction<{ title: string; content: Content }>,
    ) => {
      if (!state.selectedNoteId) return;

      const note = state.notes[state.selectedNoteId];

      if (note) {
        state.notes[note.id] = {
          ...note,
          title: action.payload.title,
          content: action.payload.content,
          updatedAt: Date.now(),
        };
      }
    },
    selectNote: (state, action: PayloadAction<string>) => {
      state.selectedNoteId = action.payload;
    },

    pinNote: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];

      if (note) {
        note.isPinned = !note.isPinned;
      }
    },

    favouriteNote: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];

      if (note) {
        note.isFavourite = !note.isFavourite;
      }
    },
    duplicateNote: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];

      const id = uuid();
      const currentTimestamp = Date.now();

      if (note) {
        state.notes[id] = {
          ...note,
          id,
          title: `Copy of ${note.title}`,
          content: `${note.title}`,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        };
      }
    },
    moveNoteToTrash: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];
      if (note) {
        note.type = "trash";
        note.readonly = true;
        note.deletedAt = Date.now();
      }
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = null;
      }
    },
    previewNote: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];
      if (note) {
        note.readonly = !note.readonly;
      }
    },
    restoreNoteFromTrash: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];
      if (note && note.type === "trash") {
        note.type = "note";
        note.readonly = false;
        note.deletedAt = 0;
      }
    },
    permaDeleteNote: (state, action: PayloadAction<string>) => {
      delete state.notes[action.payload];
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = null;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(loadNotes.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.isNotesLoading = false;
    });
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
