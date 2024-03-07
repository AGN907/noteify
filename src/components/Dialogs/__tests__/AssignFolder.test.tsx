import { setupStore } from "@/app/store";
import { renderWithProviders as render, userEvent } from "@/tests/test-utils";
import { AssignFolderDialog } from "../";
import { exampleFolder, exampleNote } from "./CONSTANTS";

describe("AssignFolderDialog", () => {
  it("should render correctly", async () => {
    const { getByText, getByRole } = render(
      <AssignFolderDialog selectedNote={exampleNote}>
        <span>Launch Dialog</span>
      </AssignFolderDialog>,
    );
    const dialogTrigger = getByText("Launch Dialog");
    expect(dialogTrigger).toBeInTheDocument();

    await userEvent.click(dialogTrigger);

    const dialog = getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const combobox = getByRole("combobox");
    expect(combobox).toBeInTheDocument();
  });
  it("should assign note to folder", async () => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    const store = setupStore({
      preloadedState: {
        folders: { folders: [exampleFolder], isFoldersLoading: false },
        notes: {
          notes: [exampleNote],
          selectedNoteId: exampleNote.id,
          isNotesLoading: false,
        },
      },
    });
    const { getByRole, getByText } = render(
      <AssignFolderDialog selectedNote={exampleNote}>
        <span>Launch Dialog</span>
      </AssignFolderDialog>,
      {
        store,
      },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    const combobox = getByRole("combobox");
    await userEvent.click(combobox);

    const option = getByText(exampleFolder.title);
    await userEvent.click(option);

    expect(combobox.textContent).toEqual(exampleFolder.title);

    const button = getByRole("button", { name: "Assign" });
    await userEvent.click(button);

    expect(store.getState().notes.notes[0].folderId).toEqual(exampleFolder.id);
  });
});
