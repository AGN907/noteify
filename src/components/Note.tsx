import { PiCopy, PiPushPinSimple, PiStar, PiTrashSimple } from "react-icons/pi";
import ListItem from "./ListItem";
import type { Item, MenuItem, Note } from "./ListItem/types";

interface NoteProps {
  note: Item<Note>;
}

export default function Note(props: NoteProps) {
  const { note } = props;

  return (
    <ListItem
      item={note}
      title={note.title}
      body={
        <div>
          <p>
            {note.content.length > 50
              ? note.content.slice(0, 50) + "..."
              : note.content}
          </p>
        </div>
      }
      footer={
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            {note.isPinned && <PiPushPinSimple size={14} />}
            {note.isFavorite && <PiStar size={14} />}
          </div>
          <div>
            <time className="text-xs">
              {new Date(note.updatedAt).toLocaleTimeString()}
            </time>
          </div>
        </div>
      }
      onItemClick={() => {}}
      isSelected={false}
      contextMenuItems={() => menuItems(note)}
    />
  );
}

const menuItems = (item: Item<Note>): Array<MenuItem | MenuItem[]> => [
  [
    {
      name: "Pin",
      key: "pin",
      onClick: () => {},
      Icon: <PiPushPinSimple size={18} />,
      isChecked: item.isPinned,
    },
    {
      name: "Favorite",
      key: "favorite",
      onClick() {},
      Icon: <PiStar size={18} />,
      isChecked: item.isFavorite,
    },
    {
      name: "Duplicate",
      key: "duplicate",
      onClick() {},
      Icon: <PiCopy size={18} />,
    },
  ],
  {
    name: "Move to trash",
    key: "trash",
    onClick() {},
    Icon: <PiTrashSimple size={18} />,
    danger: true,
  },
];
