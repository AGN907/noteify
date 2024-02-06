import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { NotesDispatch } from "@/redux/notes/notesSlice";
import {
  duplicateNote,
  favouriteNote,
  moveNoteToTrash,
  pinNote,
  previewNote,
  selectNote,
} from "@/redux/notes/notesSlice";
import {
  PiCopy,
  PiPencilSlash,
  PiPushPinSimple,
  PiStar,
  PiTrashSimple,
} from "react-icons/pi";
import ListItem from "./ListItem";
import type { Item, MenuItem, Note } from "./ListItem/types";
import { TimeAgo } from "./shared/TimeAgo";

interface NoteProps {
  note: Item<Note>;
}

export default function Note(props: NoteProps) {
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
      contextMenuItems={() => menuItems(note, dispatch)}
    />
  );
}

const menuItems = (
  item: Item<Note>,
  dispatch: NotesDispatch,
): Array<MenuItem | MenuItem[]> => [
  [
    {
      name: "Pin",
      key: "pin",
      onClick: () => dispatch(pinNote(item.id)),
      Icon: <PiPushPinSimple size={18} />,
      isChecked: item.isPinned,
    },
    {
      name: "Favorite",
      key: "favorite",
      onClick: () => dispatch(favouriteNote(item.id)),
      Icon: <PiStar size={18} />,
      isChecked: item.isFavourite,
    },
    {
      name: "Readonly",
      key: "readonly",
      onClick: () => dispatch(previewNote(item.id)),
      Icon: <PiPencilSlash size={18} />,
      isChecked: item.readonly,
    },
  ],

  [
    {
      name: "Duplicate",
      key: "duplicate",
      onClick: () => dispatch(duplicateNote(item.id)),
      Icon: <PiCopy size={18} />,
    },
  ],
  {
    name: "Move to trash",
    key: "trash",
    onClick: () => dispatch(moveNoteToTrash(item.id)),
    Icon: <PiTrashSimple size={18} />,
    danger: true,
  },
];
