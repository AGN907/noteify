import { type ReactNode } from "react";
import type { Item } from "./types";

interface ListItemProps {
  item: Item;
  title: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  onItemClick?: () => void;
  isSelected: boolean;
}

export default function ListItem(props: ListItemProps) {
  const { title, body, footer, item, onItemClick, isSelected } = props;

  return (
    <li
      onClick={() => onItemClick && onItemClick()}
      id={item.id}
      className={`flex cursor-pointer flex-col rounded-md px-2 py-2 hover:bg-accent ${isSelected ? "bg-accent" : ""}`}
    >
      <div className="flex flex-col space-y-2">
        <p className="text-base font-medium">{title}</p>
        <div className="text-xs">{body}</div>
        {footer}
      </div>
    </li>
  );
}
