import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { removeFolder, updateFolder } from "@/redux/folders/foldersSlice";
import { trashFolderNotes } from "@/redux/notes/notesSlice";
import { useState } from "react";
import { PiDotsThree } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { CreateFolderDialog, DeleteFolderDialog } from "./Dialogs/";
import ListItem from "./ListItem";
import type { ExtendedItem } from "./ListItem/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type FolderItemProps = {
  item: ExtendedItem<"folder">;
};

export default function FolderItem(props: FolderItemProps) {
  const { item } = props;
  const [selectedDialog, setSelectedDialog] = useState("");

  const { notes } = useAppSelector((state) => state.notes);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const folderNotes = Object.values(notes).filter(
    (note) => note.folderId === item.id && note.type === "note",
  );

  const handleSelectFolder = () => {
    navigate(`/folders/${item.id}`);
  };

  return (
    <ListItem
      item={item}
      title={
        <div className="flex justify-between">
          <span className="mr-auto">{item.name}</span>
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
                  onClick={() => setSelectedDialog("edit")}
                  data-state="edit"
                >
                  Edit name
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => setSelectedDialog("delete")}
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
              dispatch(updateFolder({ id: item.id, name: name }));
            }}
            defaultName={item.name}
          />
          <DeleteFolderDialog
            open={selectedDialog === "delete"}
            onOpenChange={(open) => setSelectedDialog(open ? "delete" : "")}
            onDeleteFolder={(deleteAllNotes) => {
              if (deleteAllNotes) {
                dispatch(trashFolderNotes(item.id));
              }
              dispatch(removeFolder(item.id));
            }}
          />
        </div>
      }
      body={<div>{new Date(item.updatedAt).toLocaleDateString()}</div>}
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
