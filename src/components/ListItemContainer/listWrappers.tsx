import { ComponentPropsWithoutRef } from "react";
import FolderItem from "../FolderItem";
import NoteItem from "../Note";
import TagItem from "../TagItem";

const listWrappers = {
  note: NoteItem,
  folder: FolderItem,
  tag: TagItem,
};

type ListWrappers = typeof listWrappers;
export type ListType = keyof ListWrappers;

export const wrapList = (type: ListType) => {
  const Component = listWrappers[type];

  // TODO: fix this type
  return (props: ComponentPropsWithoutRef<typeof Component>) => (
    <Component {...props} />
  );
};
