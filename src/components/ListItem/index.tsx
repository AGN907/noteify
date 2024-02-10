import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Fragment, type ReactNode } from "react";
import type { Item, MenuItem } from "./types";

interface ListItemProps {
  item: Item;
  title: ReactNode;
  body: ReactNode;
  footer: ReactNode;
  onItemClick: (itemId: string) => void;
  isSelected: boolean;
  contextMenuItems: () => Array<MenuItem | MenuItem[]>;
}

export default function ListItem(props: ListItemProps) {
  const {
    title,
    body,
    footer,
    item,
    onItemClick,
    isSelected,
    contextMenuItems,
  } = props;

  return (
    <ContextMenu key={item.id}>
      <ContextMenuTrigger>
        <li
          onClick={() => onItemClick(item.id)}
          className={`flex cursor-pointer flex-col rounded-md px-2 py-2 hover:bg-accent ${isSelected ? "bg-accent" : ""}`}
        >
          <div className="flex flex-col space-y-2">
            <p className="text-base font-medium">{title}</p>
            <div className="text-xs">{body}</div>
            {footer}
          </div>
        </li>
      </ContextMenuTrigger>
      {renderContextMenu(contextMenuItems)}
    </ContextMenu>
  );
}

const renderContextMenu = (menuItems: () => Array<MenuItem | MenuItem[]>) => {
  const renderMenuItem = ({ Component, Icon, key, name, danger }: MenuItem) => (
    <Component key={key}>
      <span className={`absolute left-2 ${danger ? "text-red-500" : ""}`}>
        {Icon}
      </span>
      <span
        className={`ml-2 ${danger ? "text-red-500 hover:text-red-500" : ""}`}
      >
        {name}
      </span>
    </Component>
  );

  return (
    <ContextMenuContent>
      {menuItems().map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <Fragment key={index}>
              {item.map((menuItem) => (
                <Fragment key={menuItem.key}>
                  {renderMenuItem(menuItem)}
                </Fragment>
              ))}
              <ContextMenuSeparator />
            </Fragment>
          );
        }

        return renderMenuItem(item);
      })}
    </ContextMenuContent>
  );
};
