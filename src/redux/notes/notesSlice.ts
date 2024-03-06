import { startAppListening } from "@/app/middleware";
import type { Item } from "@/components/ListItem/types";
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

    const notesState: Item<"note">[] = api.getState().notes.notes;
    storage.db.set(
      "notes",
      notesState.map((note) => note.id),
    );

    await Promise.all(notesState.map((note) => storage.db.set(note.id, note)));
  },
});

export type initialState = {
  notes: Item<"note">[];
  selectedNoteId: string | null;
  isNotesLoading: boolean;
};

const initialState: initialState = {
  notes: [],
  selectedNoteId: null,
  isNotesLoading: true,
};

export const loadNotes = createAsyncThunk("notes/loadNotes", async () => {
  const notesIds = (await storage.db.get<string[]>("notes")) ?? [];
  const notes = await Promise.all(
    notesIds.map((id) => storage.db.get<Item<"note">>(id)),
  );

  return notes.reduce((acc, note) => {
    if (note) {
      acc.push(note);
    }
    return acc;
  }, [] as Item<"note">[]);
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
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: 0,
        type: "note",
        isFavourite: false,
        isPinned: false,
        readonly: false,
        folderId,
        tags: [],
      };

      state.notes.push(note);

      toast.success("Note was created successfully");

      state.selectedNoteId = note.id;
    },
    updateNote: (
      state,
      action: PayloadAction<{ title?: string; content?: Content }>,
    ) => {
      if (!state.selectedNoteId) return;

      const noteIndex = state.notes?.findIndex(
        (n) => n.id === state.selectedNoteId,
      );

      if (noteIndex !== -1) {
        state.notes[noteIndex] = {
          ...state.notes[noteIndex],
          title: action.payload.title ?? state.notes[noteIndex].title,
          content: action.payload.content ?? state.notes[noteIndex].content,
          updatedAt: Date.now(),
        };
      }
    },
    selectNote: (state, action: PayloadAction<string | null>) => {
      state.selectedNoteId = action.payload;
    },

    pinNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);

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
      const note = state.notes.find((n) => n.id === action.payload);

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
      const noteIndex = state.notes.findIndex((n) => n.id === action.payload);

      const id = uuid();
      const currentTimestamp = Date.now();

      if (noteIndex !== -1) {
        const note = state.notes[noteIndex];
        state.notes.push({
          type: "note",
          id,
          title: `${note.title} - Copy`,
          content: note.content,
          isFavourite: false,
          isPinned: false,
          readonly: false,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
          deletedAt: 0,
          folderId: "",
          tags: [],
        });

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
        const noteIndex = state.notes.findIndex((n) => n.id === noteId);
        if (noteIndex !== -1) {
          const note = state.notes[noteIndex];
          state.notes[noteIndex] = {
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
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        note.readonly = !note.readonly;
      }
    },
    restoreNoteFromTrash: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note && note.type === "trash") {
        note.type = "note";
        note.readonly = false;
        note.deletedAt = 0;

        toast.success("Note was restored from trash");
      }
    },
    permaDeleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = null;
      }
    },
    assignNoteToFolder: (
      state,
      action: PayloadAction<{ noteId: string; folderId: string }>,
    ) => {
      const { noteId, folderId } = action.payload;
      const note = state.notes.find((n) => n.id === noteId);
      if (note) {
        note.folderId = folderId;
      }
    },
    removeNoteFromFolder: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        note.folderId = "";
      }
    },
    trashFolderNotes: (state, action: PayloadAction<string>) => {
      const folderId = action.payload;
      const notes = state.notes.filter((note) => note.folderId === folderId);

      notes.forEach((note) => {
        const noteIndex = state.notes.findIndex((n) => n.id === note.id);
        state.notes[noteIndex] = {
          ...note,
          type: "trash",
          readonly: true,
          deletedAt: Date.now(),
          folderId: "",
        };

        toast.success(`${notes.length} notes were moved to trash`);
      });
    },
    addTagToNote: (
      state,
      action: PayloadAction<{ noteId: string; tagId: string }>,
    ) => {
      const { noteId, tagId } = action.payload;
      const noteIndex = state.notes.findIndex((n) => n.id === noteId);

      if (noteIndex !== -1) {
        const note = state.notes[noteIndex];
        state.notes[noteIndex] = {
          ...note,
          tags: [...note.tags, tagId],
        };
      }
    },
    removeTagFromNote: (
      state,
      action: PayloadAction<{ noteId: string; tagId: string }>,
    ) => {
      const { noteId, tagId } = action.payload;
      const noteIndex = state.notes.findIndex((n) => n.id === noteId);

      if (noteIndex !== -1) {
        const note = state.notes[noteIndex];
        state.notes[noteIndex] = {
          ...note,
          tags: note.tags.filter((tag) => tag !== tagId),
        };
      }
    },
    trashTagNotes: (state, action: PayloadAction<string>) => {
      const tagId = action.payload;

      const notes = Object.values(state.notes).filter((note) =>
        note.tags.includes(tagId),
      );

      notes.forEach((note) => {
        const noteIndex = state.notes.findIndex((n) => n.id === note.id);
        state.notes[noteIndex] = {
          ...note,
          type: "trash",
          deletedAt: Date.now(),
          readonly: true,
          tags: note.tags.filter((t) => t !== tagId),
        };
      });

      toast.success(`${notes.length} notes were moved to trash`);
    },
  },
  extraReducers(builder) {
    builder.addCase(loadNotes.fulfilled, (state, action) => {
      state.notes = [...action.payload];
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
  addTagToNote,
  removeTagFromNote,
  trashTagNotes,
} = notesSlice.actions;

export default notesSlice.reducer;
