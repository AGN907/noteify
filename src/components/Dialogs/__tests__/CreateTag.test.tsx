import { setupStore } from "@/app/store";
import { addTag, updateTag } from "@/redux/tags/tagsSlice";
import { renderWithProviders as render, userEvent } from "@/tests/test-utils";
import { CreateTagDialog } from "../";
import { exampleTag } from "./CONSTANTS";

describe("CreateTagDialog", () => {
  it("should render correctly", async () => {
    const { getByText, getByPlaceholderText } = render(
      <CreateTagDialog onCreateTag={() => {}}>
        <span>Launch Dialog</span>
      </CreateTagDialog>,
    );

    const dialogTrigger = getByText("Launch Dialog");
    expect(dialogTrigger).toBeInTheDocument();

    await userEvent.click(dialogTrigger);

    const dialog = getByText("Create tag");
    expect(dialog).toBeInTheDocument();

    const input = getByPlaceholderText("Enter tag title");
    expect(input).toBeInTheDocument();
  });
  it("should create tag", async () => {
    const store = setupStore({});
    const onCreateTag = (title: string) => store.dispatch(addTag({ title }));

    const { getByText, getByPlaceholderText } = render(
      <CreateTagDialog onCreateTag={onCreateTag}>
        <span>Launch Dialog</span>
      </CreateTagDialog>,
      { store },
    );
    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    expect(store.getState().tags.tags).toHaveLength(0);

    const input = getByPlaceholderText("Enter tag title");
    await userEvent.type(input, "folder1");

    await userEvent.click(getByText("Create"));

    expect(store.getState().tags.tags).toHaveLength(1);
  });
  it("should rename tag", async () => {
    const store = setupStore({
      preloadedState: {
        tags: {
          tags: [exampleTag],
        },
      },
    });
    const onCreateTag = (title: string) =>
      store.dispatch(updateTag({ id: exampleTag.id, title }));

    const { getByText, getByDisplayValue } = render(
      <CreateTagDialog onCreateTag={onCreateTag} defaultName={exampleTag.title}>
        <span>Launch Dialog</span>
      </CreateTagDialog>,
      { store },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    expect(store.getState().tags.tags).toHaveLength(1);
    expect(store.getState().tags.tags[0].title).toBe("tag1");

    const input = getByDisplayValue("tag1");

    await userEvent.clear(input);
    await userEvent.type(input, "tag2");

    await userEvent.click(getByText("Rename"));

    expect(store.getState().tags.tags).toHaveLength(1);
    expect(store.getState().tags.tags[0].title).toBe("tag2");
  });
});
