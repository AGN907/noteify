import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AppDispatch } from "@/app/store";
import { removeFolder, updateFolder } from "@/redux/folders/foldersSlice";
import { trashFolderNotes } from "@/redux/notes/notesSlice";
import { PiPencilSimple, PiTrash } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { CreateFolderDialog, DeleteFolderDialog } from "./Dialogs/";
import ListItem from "./ListItem";
import type { Folder, Item, MenuItem } from "./ListItem/types";
import { ContextMenuItem } from "./ui/context-menu";

type FolderItemProps = {
  folder: Item<Folder>;
};

export default function FolderItem(props: FolderItemProps) {
  const { folder } = props;

  const { notes } = useAppSelector((state) => state.notes);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const folderNotes = Object.values(notes).filter(
    (note) => note.folderId === folder.id && note.type === "note",
  );

  const handleSelectFolder = () => {
    navigate(`/folders/${folder.id}`);
  };

  return (
    <ListItem
      item={folder}
      title={folder.name}
      body={<div>{new Date(folder.updatedAt).toLocaleDateString()}</div>}
      footer={
        <div>
          {folderNotes.length === 0
            ? "No notes"
            : `${folderNotes.length} ${folderNotes.length === 1 ? "note" : "notes"}`}
        </div>
      }
      onItemClick={handleSelectFolder}
      isSelected={false}
      contextMenuItems={() => menuItems(folder, dispatch)}
    />
  );
}

const menuItems = (
  folder: Item<Folder>,
  dispatch: AppDispatch,
): Array<MenuItem | MenuItem[]> => [
  {
    name: "Rename",
    key: "rename",
    Icon: <PiPencilSimple size={18} />,
    Component: ({ children }) => (
      <CreateFolderDialog
        onCreateFolder={(name) => {
          if (!name) return;
          dispatch(updateFolder({ id: folder.id, name }));
        }}
        defaultName={folder.name}
      >
        <ContextMenuItem inset onSelect={(e) => e.preventDefault()}>
          {children}
        </ContextMenuItem>
      </CreateFolderDialog>
    ),
  },
  {
    name: "Delete",
    key: "delete",
    danger: true,
    Icon: <PiTrash size={18} />,
    Component: ({ children }) => (
      <DeleteFolderDialog
        onDeleteFolder={(deleteNotes) => {
          if (deleteNotes) {
            dispatch(trashFolderNotes(folder.id));
          }

          dispatch(removeFolder(folder.id));
        }}
      >
        <ContextMenuItem inset onSelect={(e) => e.preventDefault()}>
          {children}
        </ContextMenuItem>
      </DeleteFolderDialog>
    ),
  },
];
