import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  duplicateNote,
  favouriteNote,
  moveNoteToTrash,
  pinNote,
  previewNote,
  selectNote,
} from "@/redux/notes/notesSlice";
import { useState } from "react";
import { PiDotsThree, PiPushPinSimple, PiStar } from "react-icons/pi";
import { AssignFolderDialog } from "./Dialogs/";
import ListItem from "./ListItem";
import type { Item, Note } from "./ListItem/types";
import { TimeAgo } from "./shared/TimeAgo";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NoteProps {
  note: Item<Note>;
}

export default function Note(props: NoteProps) {
  const { note } = props;
  const [openDialog, setOpenDialog] = useState(false);

  const { selectedNoteId } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();

  const isSelected = note.id === selectedNoteId;

  return (
    <ListItem
      item={note}
      title={
        <div className="flex justify-between">
          <span className="mr-auto">{note.title}</span>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <PiDotsThree size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  onSelect={() => dispatch(pinNote(note.id))}
                  checked={note.isPinned}
                >
                  Pinned
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  onSelect={() => dispatch(favouriteNote(note.id))}
                  checked={note.isFavourite}
                >
                  Favourite
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  onSelect={() => dispatch(previewNote(note.id))}
                  checked={note.readonly}
                >
                  Read Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => dispatch(duplicateNote(note.id))}
                >
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setOpenDialog(true)}>
                  Assign to folder
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => dispatch(moveNoteToTrash(note.id))}
                >
                  <span className="text-red-500">Move to trash</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <AssignFolderDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            selectedNote={note}
          >
            <span></span>
          </AssignFolderDialog>
        </div>
      }
      footer={
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            {note.isPinned && <PiPushPinSimple size={14} />}
            {note.isFavourite && <PiStar size={14} />}
          </div>
          <div>
            <TimeAgo timestamp={note.updatedAt} />
          </div>
        </div>
      }
      onItemClick={() => dispatch(selectNote(note.id))}
      isSelected={isSelected}
    />
  );
}
