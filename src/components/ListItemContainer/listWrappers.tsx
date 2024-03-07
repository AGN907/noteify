import { ComponentProps } from "react";
import FolderItem from "../FolderItem";
import { ListTypes } from "../ListItem/types";
import NoteItem from "../NoteItem";
import TagItem from "../TagItem";
import TrashItem from "../TrashItem";

type ListWrappers = {
  note: typeof NoteItem;
  folder: typeof FolderItem;
  tag: typeof TagItem;
  trash: typeof TrashItem;
};

const listWrappers = {
  note: NoteItem,
  folder: FolderItem,
  tag: TagItem,
  trash: TrashItem,
};

export type ListType = keyof ListWrappers;

type Props =
  | ComponentProps<typeof NoteItem>
  | ComponentProps<typeof FolderItem>
  | ComponentProps<typeof TagItem>
  | ComponentProps<typeof TrashItem>;

export const getListWrapper = (type: keyof ListTypes) => (props: Props) => {
  const Component = listWrappers[type] as (props: Props) => JSX.Element;

  if (!Component) {
    throw new Error(`No wrapper found for type: ${type}`);
  }

  return <Component {...props} />;
};
