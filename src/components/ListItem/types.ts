import type { Content } from "@tiptap/react";

export type Item = {
  id: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
};

export type ItemTypes = {
  note: Note;
  folder: Folder;
  tag: Tag;
};

export type ItemProps<K extends keyof ItemTypes> = {
  [P in keyof ItemTypes[K]]: ItemTypes[K][P];
};

export type ExtendedItem<T extends keyof ItemTypes> = Item & ItemProps<T>;

export type ListTypes = {
  note: ExtendedItem<"note">;
  folder: ExtendedItem<"folder">;
  tag: ExtendedItem<"tag">;
  trash: ExtendedItem<"note">;
};

export type Note = {
  title: string;
  content: Content;
  isPinned: boolean;
  readonly: boolean;
  isFavourite: boolean;
  tags: string[];
  folderId: string;
};

export type Tag = {
  name: string;
};

export type Folder = {
  name: string;
};
