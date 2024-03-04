import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { removeFolder, updateFolder } from "@/redux/folders/foldersSlice";
import { trashFolderNotes } from "@/redux/notes/notesSlice";
import { useState } from "react";
import { PiDotsThree } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { CreateFolderDialog, DeleteFolderDialog } from "./Dialogs/";
import ListItem from "./ListItem";
import type { Folder, Item } from "./ListItem/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type FolderItemProps = {
  folder: Item<Folder>;
};

export default function FolderItem(props: FolderItemProps) {
  const { folder } = props;
  const [selectedDialog, setSelectedDialog] = useState("");

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
      title={
        <div className="flex justify-between">
          <span className="mr-auto">{folder.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <PiDotsThree size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={handleSelectFolder}>
                  View folder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    setSelectedDialog("edit");
                    e.stopPropagation();
                  }}
                  data-state="edit"
                >
                  Edit name
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDialog("delete");
                  }}
                  data-state="delete"
                >
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateFolderDialog
            open={selectedDialog === "edit"}
            onOpenChange={(open) => setSelectedDialog(open ? "edit" : "")}
            onCreateFolder={(name) => {
              dispatch(updateFolder({ id: folder.id, name: name }));
            }}
            defaultName={folder.name}
          />
          <DeleteFolderDialog
            open={selectedDialog === "delete"}
            onOpenChange={(open) => setSelectedDialog(open ? "delete" : "")}
            onDeleteFolder={(deleteAllNotes) => {
              if (deleteAllNotes) {
                dispatch(trashFolderNotes(folder.id));
              }
              dispatch(removeFolder(folder.id));
            }}
          />
        </div>
      }
      body={<div>{new Date(folder.updatedAt).toLocaleDateString()}</div>}
      footer={
        <div>
          {folderNotes.length === 0
            ? "No notes"
            : `${folderNotes.length} ${folderNotes.length === 1 ? "note" : "notes"}`}
        </div>
      }
      isSelected={false}
    />
  );
}
