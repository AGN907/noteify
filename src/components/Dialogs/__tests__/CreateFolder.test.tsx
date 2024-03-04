import { setupStore } from "@/app/store";
import { addFolder, updateFolder } from "@/redux/folders/foldersSlice";
import { renderWithProviders as render, userEvent } from "@/tests/test-utils";
import { CreateFolderDialog } from "../";
import { exampleFolder } from "./CONSTANTS";

describe("CreateFolderDialog", () => {
  it("should render correctly", async () => {
    const { getByText, getByPlaceholderText } = render(
      <CreateFolderDialog onCreateFolder={() => {}}>
        <span>Launch Dialog</span>
      </CreateFolderDialog>,
    );

    const dialogTrigger = getByText("Launch Dialog");
    expect(dialogTrigger).toBeInTheDocument();

    await userEvent.click(dialogTrigger);

    const dialog = getByText("Create folder");
    expect(dialog).toBeInTheDocument();

    const input = getByPlaceholderText("Enter folder name");
    expect(input).toBeInTheDocument();
  });
  it("should create folder", async () => {
    const store = setupStore({});

    const onCreateFolder = (name: string) =>
      store.dispatch(addFolder({ name: name }));

    const { getByText, getByPlaceholderText } = render(
      <CreateFolderDialog onCreateFolder={onCreateFolder}>
        <span>Launch Dialog</span>
      </CreateFolderDialog>,
      { store },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    expect(store.getState().folders.folders).toHaveLength(0);

    const input = getByPlaceholderText("Enter folder name");
    await userEvent.type(input, "folder1");
    await userEvent.click(getByText("Create"));

    expect(store.getState().folders.folders).toHaveLength(1);
  });
  it("should rename folder if defaultName is passed", async () => {
    const store = setupStore({
      preloadedState: {
        folders: {
          folders: [exampleFolder],
          isFoldersLoading: false,
        },
      },
    });

    const onCreateFolder = (name: string) =>
      store.dispatch(updateFolder({ id: exampleFolder.id, name: name }));

    const { getByText, getByDisplayValue } = render(
      <CreateFolderDialog onCreateFolder={onCreateFolder} defaultName="test">
        <span>Launch Dialog</span>
      </CreateFolderDialog>,
      { store },
    );

    const dialogTrigger = getByText("Launch Dialog");
    await userEvent.click(dialogTrigger);

    expect(store.getState().folders.folders).toHaveLength(1);
    expect(store.getState().folders.folders[0].name).toBe("folder1");

    const input = getByDisplayValue("test");

    await userEvent.clear(input);
    await userEvent.type(input, "folder2");
    await userEvent.click(getByText("Rename"));

    expect(store.getState().folders.folders).toHaveLength(1);
    expect(store.getState().folders.folders[0].name).toBe("folder2");
  });
});
