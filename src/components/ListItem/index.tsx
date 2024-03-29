import { Ref, forwardRef, type ReactNode } from "react";
import type { Item } from "./types";

interface ListItemProps {
  item: Item;
  title: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  onItemClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  isSelected: boolean;
}

const ListItem = forwardRef((props: ListItemProps, ref: Ref<HTMLLIElement>) => {
  const { item, title, body, footer, onItemClick, isSelected } = props;
  return (
    <li
      onClick={(e) => onItemClick && onItemClick(e)}
      ref={ref}
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
});

ListItem.displayName = "ListItem";

export default ListItem;
