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
import { AssignFolderDialog } from "./Dialogs";
import ListItem from "./ListItem";
import type { ExtendedItem } from "./ListItem/types";
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
  item: ExtendedItem<"note">;
}

export default function NoteItem(props: NoteProps) {
  const { item } = props;
  const [openDialog, setOpenDialog] = useState(false);

  const { selectedNoteId } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();

  const isSelected = item.id === selectedNoteId;

  return (
    <ListItem
      item={item}
      title={
        <div className="flex justify-between">
          <span className="mr-auto">{item.title}</span>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <PiDotsThree size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(pinNote(item.id));
                  }}
                  checked={item.isPinned}
                >
                  Pinned
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(favouriteNote(item.id));
                  }}
                  checked={item.isFavourite}
                >
                  Favourite
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(previewNote(item.id));
                  }}
                  checked={item.readonly}
                >
                  Read Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(duplicateNote(item.id));
                  }}
                >
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDialog(true);
                  }}
                >
                  Assign to folder
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(moveNoteToTrash(item.id));
                  }}
                >
                  <span className="text-red-500">Move to trash</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <AssignFolderDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            selectedNote={item}
          >
            <span></span>
          </AssignFolderDialog>
        </div>
      }
      footer={
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            {item.isPinned && <PiPushPinSimple size={14} />}
            {item.isFavourite && <PiStar size={14} />}
          </div>
          <div>
            <TimeAgo timestamp={item.createdAt} />
          </div>
        </div>
      }
      onItemClick={() => {
        dispatch(selectNote(item.id));
      }}
      isSelected={isSelected}
    />
  );
}
