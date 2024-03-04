import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  permaDeleteNote,
  restoreNoteFromTrash,
  selectNote,
} from "@/redux/notes/notesSlice";
import { PiDotsThree } from "react-icons/pi";
import ListItem from "./ListItem";
import type { Item, Note } from "./ListItem/types";
import { TimeAgo } from "./shared/TimeAgo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TrashNoteProps {
  note: Item<Note>;
}

export default function TrashNote(props: TrashNoteProps) {
  const { note } = props;
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
                <DropdownMenuItem
                  onSelect={() => dispatch(restoreNoteFromTrash(note.id))}
                >
                  Restore note
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => dispatch(permaDeleteNote(note.id))}
                >
                  <span className="text-red-500">Delete forever</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
      footer={
        <div className="ml-auto">
          <TimeAgo timestamp={note.deletedAt} />
        </div>
      }
      isSelected={isSelected}
      onItemClick={() => dispatch(selectNote(note.id))}
    />
  );
}
