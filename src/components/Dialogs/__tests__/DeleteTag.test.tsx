import { renderWithProviders as render, userEvent } from "@/tests/test-utils";

import { setupStore } from "@/app/store";
import { trashTagNotes } from "@/redux/notes/notesSlice";
import { removeTag } from "@/redux/tags/tagsSlice";
import { DeleteTagDialog } from "../";
import { exampleNote, exampleTag } from "./CONSTANTS";

describe("DeleteTagDialog", () => {
  it("should render correctly", async () => {
    const { getByText, getByRole } = render(
      <DeleteTagDialog onDeleteTag={() => {}}>
        <span>Launch Dialog</span>
      </DeleteTagDialog>,
    );
    const dialogTrigger = getByText("Launch Dialog");
    expect(dialogTrigger).toBeInTheDocument();

    await userEvent.click(dialogTrigger);

    const dialog = getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();

    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });
  it("should delete tag", async () => {
    const store = setupStore({
      preloadedState: {
        tags: { tags: [exampleTag] },
      },
    });
    const onDeleteTag = () => store.dispatch(removeTag(exampleTag.id));

    const { getByRole, getByText } = render(
      <DeleteTagDialog onDeleteTag={onDeleteTag}>
        <span>Launch Dialog</span>
      </DeleteTagDialog>,
      { store },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    expect(store.getState().tags.tags).toHaveLength(1);

    await userEvent.click(getByRole("button", { name: "Delete" }));

    expect(store.getState().tags.tags).toHaveLength(0);
  });
  it("should delete tag with all assigned notes", async () => {
    const store = setupStore({
      preloadedState: {
        tags: { tags: [exampleTag] },
        notes: {
          notes: [exampleNote],
          selectedNoteId: exampleNote.id,
          isNotesLoading: false,
        },
      },
    });
    const onDeleteTag = (deleteAllNotes: boolean) => {
      store.dispatch(removeTag(exampleTag.id));
      if (deleteAllNotes) {
        store.dispatch(trashTagNotes(exampleTag.id));
      }
    };

    const { getByText, getByRole } = render(
      <DeleteTagDialog onDeleteTag={onDeleteTag}>
        <span>Launch Dialog</span>
      </DeleteTagDialog>,
      { store },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    const checkbox = getByRole("checkbox");
    await userEvent.click(checkbox);

    expect(store.getState().tags.tags).toHaveLength(1);
    expect(store.getState().notes.notes).toHaveLength(1);

    await userEvent.click(getByRole("button", { name: "Delete" }));

    expect(store.getState().tags.tags).toHaveLength(0);
    expect(store.getState().notes.notes[0].type).toEqual("trash");
  });
});
