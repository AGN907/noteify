import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { CreateFolderDialog } from "@/components/Dialogs/";
import FolderItem from "@/components/FolderItem";
import ListItemContainer from "@/components/ListItemContainer";
import { Button } from "@/components/ui/button";
import { addFolder } from "@/redux/folders/foldersSlice";
import { PiFolderPlus } from "react-icons/pi";

export default function Folders() {
  const { folders } = useAppSelector((state) => state.folders);
  const dispatch = useAppDispatch();

  const handleCreateFolder = (name: string) => {
    if (!name) return;

    dispatch(addFolder({ name }));
  };

  const foldersArray = Object.values(folders);

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Folders</h2>
        <CreateFolderDialog onCreateFolder={handleCreateFolder}>
          <Button aria-label="Create a new folder" variant="link" size="icon">
            <PiFolderPlus size={32} />
          </Button>
        </CreateFolderDialog>
      </div>
      <div>
        {foldersArray.length === 0 && (
          <div className="flex items-center justify-center space-x-2 px-4 pt-32">
            <p>No folders yet. Click the button to create a new folder.</p>
          </div>
        )}
        <ListItemContainer
          items={foldersArray}
          renderItem={(folder) => <FolderItem folder={folder} />}
        />
      </div>
    </div>
  );
}
