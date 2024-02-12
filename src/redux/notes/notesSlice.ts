import { startAppListening } from "@/app/middleware";
import type { Item, Note } from "@/components/ListItem/types";
import storage from "@/lib/db";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Content } from "@tiptap/react";
import { toast } from "sonner";
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
  effect: async (action, api) => {
    if (action.type === "notes/permaDeleteNote") {
      await storage.db.remove(action.payload as string);
    }

    const notesState: Record<string, Item<Note>> = api.getState().notes.notes;
    storage.db.set("notes", Object.keys(notesState));

    const notes = Object.values(notesState);
    await Promise.all(notes.map((note) => storage.db.set(note.id, note)));
  },
});

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
    createNote: (state, action: PayloadAction<string | undefined>) => {
      const folderId = action?.payload ?? "";

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
        folderId,
      };

      state.notes[note.id] = note;

      toast.success("Note was created successfully");

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

        if (note.isPinned) {
          toast.success("Note was pinned successfully");
        } else {
          toast("Note was unpinned");
        }
      }
    },

    favouriteNote: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];

      if (note) {
        note.isFavourite = !note.isFavourite;

        if (note.isFavourite) {
          toast.success("Note was added to favourites");
        } else {
          toast("Note was removed from favourites");
        }
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
          title: `${note.title}`,
          content: note.content,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        };

        toast.success("Note was duplicated successfully");
      }
    },
    moveNoteToTrash: (state, action: PayloadAction<string | string[]>) => {
      let noteIds: string[];
      if (Array.isArray(action.payload)) {
        noteIds = action.payload;
      } else {
        noteIds = [action.payload];
      }

      noteIds.forEach((noteId) => {
        const note = state.notes[noteId];
        if (note) {
          state.notes[noteId] = {
            ...note,
            type: "trash",
            deletedAt: Date.now(),
            readonly: true,
          };
        }
      });

      if (state.selectedNoteId && noteIds.includes(state.selectedNoteId)) {
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

        toast.success("Note was restored from trash");
      }
    },
    permaDeleteNote: (state, action: PayloadAction<string>) => {
      delete state.notes[action.payload];
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = null;
      }
    },
    assignNoteToFolder: (
      state,
      action: PayloadAction<{ noteId: string; folderId: string }>,
    ) => {
      const { noteId, folderId } = action.payload;
      const note = state.notes[noteId];
      if (note) {
        state.notes[noteId] = {
          ...note,
          folderId,
        };
      }
    },
    removeNoteFromFolder: (state, action: PayloadAction<string>) => {
      const note = state.notes[action.payload];
      if (note) {
        state.notes[note.id] = {
          ...note,
          folderId: "",
        };
      }
    },
    trashFolderNotes: (state, action: PayloadAction<string>) => {
      const folderId = action.payload;
      const notes = Object.values(state.notes).filter(
        (note) => note.folderId === folderId,
      );

      notes.forEach((note) => {
        state.notes[note.id] = {
          ...note,
          type: "trash",
          readonly: true,
          deletedAt: Date.now(),
          folderId: "",
        };

        toast.success(`${notes.length} notes were moved to trash`);
      });
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
  assignNoteToFolder,
  removeNoteFromFolder,
  trashFolderNotes,
} = notesSlice.actions;

export default notesSlice.reducer;
