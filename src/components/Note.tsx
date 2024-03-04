import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { AppDispatch } from "@/app/store";
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
  PiFolder,
  PiPencilSlash,
  PiPushPinSimple,
  PiStar,
  PiTrashSimple,
} from "react-icons/pi";
import { AssignFolderDialog } from "./Dialogs/";
import ListItem from "./ListItem";
import type { Item, MenuItem, Note } from "./ListItem/types";
import { TimeAgo } from "./shared/TimeAgo";
import { ContextMenuCheckboxItem, ContextMenuItem } from "./ui/context-menu";
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
  dispatch: AppDispatch,
): Array<MenuItem | MenuItem[]> => [
  [
    {
      name: "Pin",
      key: "pin",
      Icon: <PiPushPinSimple size={18} />,
      Component: ({ children }) => (
        <ContextMenuCheckboxItem
          checked={item.isPinned}
          onSelect={() => dispatch(pinNote(item.id))}
        >
          {children}
        </ContextMenuCheckboxItem>
      ),
    },
    {
      name: "Favorite",
      key: "favorite",
      Icon: <PiStar size={18} />,
      Component: ({ children }) => (
        <ContextMenuCheckboxItem
          checked={item.isFavourite}
          onSelect={() => dispatch(favouriteNote(item.id))}
        >
          {children}
        </ContextMenuCheckboxItem>
      ),
    },
    {
      name: "Readonly",
      key: "readonly",
      Icon: <PiPencilSlash size={18} />,
      Component: ({ children }) => (
        <ContextMenuCheckboxItem
          checked={item.readonly}
          onSelect={() => dispatch(previewNote(item.id))}
        >
          {children}
        </ContextMenuCheckboxItem>
      ),
    },
  ],

  [
    {
      name: "Duplicate",
      key: "duplicate",
      Icon: <PiCopy size={18} />,
      Component: ({ children }) => (
        <ContextMenuItem
          inset
          onSelect={() => dispatch(duplicateNote(item.id))}
        >
          {children}
        </ContextMenuItem>
      ),
    },
    {
      name: "Assign to folder",
      key: "assign-to-folder",
      Icon: <PiFolder size={18} />,
      Component: ({ children }) => (
        <AssignFolderDialog selectedNote={item}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()} inset>
            {children}
          </ContextMenuItem>
        </AssignFolderDialog>
      ),
    },
  ],
  {
    name: "Move to trash",
    key: "trash",
    Icon: <PiTrashSimple size={18} />,
    danger: true,
    Component: ({ children }) => (
      <ContextMenuItem
        inset
        onSelect={() => {
          dispatch(moveNoteToTrash(item.id));
        }}
      >
        {children}
      </ContextMenuItem>
    ),
  },
];
