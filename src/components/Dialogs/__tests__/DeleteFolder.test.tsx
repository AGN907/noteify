import { renderWithProviders as render, userEvent } from "@/tests/test-utils";

import { setupStore } from "@/app/store";
import { removeFolder } from "@/redux/folders/foldersSlice";
import { trashFolderNotes } from "@/redux/notes/notesSlice";
import { DeleteFolderDialog } from "../";
import { exampleFolder, exampleNote } from "./CONSTANTS";

describe("DeleteFolderDialog", () => {
  it("should render correctly", async () => {
    const { getByText, getByRole } = render(
      <DeleteFolderDialog onDeleteFolder={() => {}}>
        <span>Launch Dialog</span>
      </DeleteFolderDialog>,
    );
    const dialogTrigger = getByText("Launch Dialog");
    expect(dialogTrigger).toBeInTheDocument();

    await userEvent.click(dialogTrigger);

    const dialog = getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();

    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });
  it("should delete folder", async () => {
    const store = setupStore({
      preloadedState: {
        folders: { folders: [exampleFolder], isFoldersLoading: false },
      },
    });
    const onDeleteFolder = (deleteAllNotes: boolean) => {
      store.dispatch(removeFolder(exampleFolder.id));
      if (deleteAllNotes) {
        store.dispatch(trashFolderNotes(exampleFolder.id));
      }
    };

    const { getByRole, getByText } = render(
      <DeleteFolderDialog onDeleteFolder={onDeleteFolder}>
        <span>Launch Dialog</span>
      </DeleteFolderDialog>,
      { store },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    expect(store.getState().folders.folders).toHaveLength(1);

    await userEvent.click(getByRole("button", { name: "Delete" }));

    expect(store.getState().folders.folders).toHaveLength(0);
  });
  it("should delete folder with all assigned notes", async () => {
    const store = setupStore({
      preloadedState: {
        folders: { folders: [exampleFolder], isFoldersLoading: false },
        notes: {
          notes: [{ ...exampleNote, folderId: exampleFolder.id }],
          selectedNoteId: exampleNote.id,
          isNotesLoading: false,
        },
      },
    });
    const onDeleteFolder = (deleteAllNotes: boolean) => {
      store.dispatch(removeFolder(exampleFolder.id));
      if (deleteAllNotes) {
        store.dispatch(trashFolderNotes(exampleFolder.id));
      }
    };

    const { getByText, getByRole } = render(
      <DeleteFolderDialog onDeleteFolder={onDeleteFolder}>
        <span>Launch Dialog</span>
      </DeleteFolderDialog>,
      { store },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    const checkbox = getByRole("checkbox");
    await userEvent.click(checkbox);

    expect(store.getState().folders.folders).toHaveLength(1);
    expect(store.getState().notes.notes).toHaveLength(1);

    await userEvent.click(getByRole("button", { name: "Delete" }));

    expect(store.getState().folders.folders).toHaveLength(0);
    expect(store.getState().notes.notes[0].type).toEqual("trash");
  });
});
