import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AppDispatch } from "@/app/store";
import {
  permaDeleteNote,
  restoreNoteFromTrash,
  selectNote,
} from "@/redux/notes/notesSlice";
import { PiRecycle, PiTrash } from "react-icons/pi";
import ListItem from "./ListItem";
import type { Item, MenuItem, Note } from "./ListItem/types";
import { TimeAgo } from "./shared/TimeAgo";

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
      title={note.title}
      body={<div></div>}
      footer={
        <div className="ml-auto">
          <TimeAgo timestamp={note.deletedAt} />
        </div>
      }
      isSelected={isSelected}
      onItemClick={() => dispatch(selectNote(note.id))}
      contextMenuItems={() => menuItems(note, dispatch)}
    />
  );
}

const menuItems = (
  note: Item<Note>,
  dispatch: AppDispatch,
): Array<MenuItem | MenuItem[]> => [
  {
    name: "Restore",
    key: "restore",
    Icon: <PiRecycle size={18} />,
    onClick: () => dispatch(restoreNoteFromTrash(note.id)),
  },
  {
    name: "Delete forever",
    key: "delete",
    Icon: <PiTrash size={18} />,
    onClick: () => dispatch(permaDeleteNote(note.id)),
    danger: true,
  },
];