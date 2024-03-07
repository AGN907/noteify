import { setupStore } from "@/app/store";
import { addTagToNote, removeTagFromNote } from "@/redux/notes/notesSlice";
import { addTag } from "@/redux/tags/tagsSlice";
import { renderWithProviders as render, userEvent } from "@/tests/test-utils";
import { AssignTagDialog } from "../";
import { exampleNote, exampleTag } from "./CONSTANTS";

describe("AssignTagDialog", () => {
  it("should not render if no note is selected", async () => {
    const { queryByText } = render(
      <AssignTagDialog onTagAssign={() => {}} onTagRemove={() => {}}>
        <span>Launch Dialog</span>
      </AssignTagDialog>,
      {
        preloadedState: {
          notes: { selectedNoteId: null, notes: [], isNotesLoading: false },
        },
      },
    );

    expect(queryByText("Launch Dialog")).not.toBeInTheDocument();
  });
  it("should render if there is a note selected", async () => {
    const { getByText, getByRole, getByPlaceholderText } = render(
      <AssignTagDialog onTagAssign={() => {}} onTagRemove={() => {}}>
        <span>Launch Dialog</span>
      </AssignTagDialog>,
      {
        preloadedState: {
          notes: {
            selectedNoteId: "1",
            notes: [exampleNote],
            isNotesLoading: false,
          },
        },
      },
    );

    const triggerButton = getByText("Launch Dialog");
    expect(triggerButton).toBeInTheDocument();

    await userEvent.click(triggerButton);

    const dialog = getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const input = getByPlaceholderText("Enter tag title");
    expect(input).toBeInTheDocument();
  });
  it("should render selected note tags", async () => {
    const { getByText } = render(
      <AssignTagDialog onTagAssign={() => {}} onTagRemove={() => {}}>
        <span>Launch Dialog</span>
      </AssignTagDialog>,
      {
        preloadedState: {
          notes: {
            selectedNoteId: "1",
            notes: [exampleNote],
            isNotesLoading: false,
          },
          tags: {
            tags: [exampleTag, { ...exampleTag, id: "2", title: "tag2" }],
          },
        },
      },
    );

    const triggerButton = getByText("Launch Dialog");
    await userEvent.click(triggerButton);

    expect(getByText("tag1")).toBeInTheDocument();
    expect(getByText("tag2")).toBeInTheDocument();
  });

  it("should remove note tag from selected note if it is clicked", async () => {
    const preloadedState = {
      notes: {
        selectedNoteId: "1",
        notes: [exampleNote],
        isNotesLoading: false,
      },
      tags: {
        tags: [exampleTag, { ...exampleTag, id: "2", title: "tag2" }],
      },
    };
    const store = setupStore({ preloadedState });
    const onTagRemove = (tagId: string) =>
      store.dispatch(removeTagFromNote({ noteId: exampleNote.id, tagId }));

    const { getByText, getByLabelText, queryByLabelText } = render(
      <AssignTagDialog onTagAssign={() => {}} onTagRemove={onTagRemove}>
        <span>Launch Dialog</span>
      </AssignTagDialog>,
      {
        store: store,
      },
    );

    const triggerButton = getByText("Launch Dialog");
    await userEvent.click(triggerButton);

    const removeTagButton = getByLabelText("Remove tag");
    await userEvent.click(removeTagButton);

    const tag = queryByLabelText(exampleTag.title + " tag");

    expect(tag).not.toBeInTheDocument();
    expect(store.getState().notes.notes[0].tags).toEqual([]);
  });
  it("should render not selected tags", async () => {
    const preloadedState = {
      notes: {
        selectedNoteId: "1",
        notes: [exampleNote],
        isNotesLoading: false,
      },
      tags: {
        tags: [exampleTag, { ...exampleTag, id: "2", name: "tag2" }],
      },
    };

    const { getByText } = render(
      <AssignTagDialog onTagAssign={() => {}} onTagRemove={() => {}}>
        <span>Launch Dialog</span>
      </AssignTagDialog>,
      {
        preloadedState: preloadedState,
      },
    );

    const triggerButton = getByText("Launch Dialog");
    await userEvent.click(triggerButton);

    expect(getByText("tag2")).toBeInTheDocument();
  });
  it("should add new tag to note if an already created, not selected tag is clicked", async () => {
    const preloadedState = {
      notes: {
        selectedNoteId: "1",
        notes: [exampleNote],
        isNotesLoading: false,
      },
      tags: {
        tags: [exampleTag, { ...exampleTag, id: "2", title: "tag2" }],
      },
    };
    const store = setupStore({ preloadedState });
    const onTagAssign = (tagId: string) =>
      store.dispatch(addTagToNote({ noteId: "1", tagId }));

    const { getByText } = render(
      <AssignTagDialog onTagAssign={onTagAssign} onTagRemove={() => {}}>
        <span>Launch Dialog</span>
      </AssignTagDialog>,
      {
        store: store,
      },
    );

    const triggerButton = getByText("Launch Dialog");
    await userEvent.click(triggerButton);

    expect(store.getState().notes.notes[0].tags).toEqual(["1"]);

    const tag = getByText("tag2");
    await userEvent.click(tag);

    expect(store.getState().notes.notes[0].tags).toEqual(["1", "2"]);
  });
  it('should add new tag to note if input is filled and "Enter" is pressed', async () => {
    const preloadedState = {
      notes: {
        selectedNoteId: "1",
        notes: [exampleNote],
        isNotesLoading: false,
      },
      tags: {
        tags: [exampleTag, { ...exampleTag, id: "2", title: "tag2" }],
      },
    };

    const store = setupStore({ preloadedState });
    const onTagAssign = (tagId: string) => {
      store.dispatch(addTag({ id: "3", title: tagId }));
      store.dispatch(addTagToNote({ noteId: "1", tagId: "3" }));
    };

    const { getByText, getByRole } = render(
      <AssignTagDialog onTagAssign={onTagAssign} onTagRemove={() => {}}>
        <span>Launch Dialog</span>
      </AssignTagDialog>,
      {
        store,
      },
    );

    const triggerButton = getByText("Launch Dialog");
    await userEvent.click(triggerButton);

    const input = getByRole("textbox");
    await userEvent.type(input, "tag3");
    await userEvent.type(input, "{enter}");

    expect(store.getState().tags.tags).toHaveLength(3);
    expect(store.getState().notes.notes[0].tags).toEqual(["1", "3"]);
  });
});
