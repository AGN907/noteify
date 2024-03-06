import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { assignNoteToFolder } from "@/redux/notes/notesSlice";
import { SelectValue } from "@radix-ui/react-select";
import { useState } from "react";
import type { Item } from "../ListItem/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

type AssignFolderDialogProps = {
  children?: React.ReactNode;
  selectedNote: Item<"note">;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function AssignFolderDialog(props: AssignFolderDialogProps) {
  const { children, selectedNote, ...restProps } = props;
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  const dispatch = useAppDispatch();
  const { folders } = useAppSelector((state) => state.folders);

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  const handleAssignNoteToFolder = () => {
    if (!selectedFolderId) return;

    dispatch(
      assignNoteToFolder({
        noteId: selectedNote.id,
        folderId: selectedFolderId,
      }),
    );
  };

  return (
    <Dialog {...restProps}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-lg">Assign note to folder</DialogHeader>
        <div className="mt-4">
          <p>Choose a folder to assign the note to.</p>
          <div className="p-4">
            <Select onValueChange={(value) => handleSelectFolder(value)}>
              <SelectTrigger className="focus:outline-none focus:ring-0 focus:ring-transparent">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} id={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleAssignNoteToFolder}>Assign</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
