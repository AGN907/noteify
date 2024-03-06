import type { Content } from "@tiptap/react";

export type ItemTypes = {
  note: Note;
  folder: Folder;
  tag: Tag;
};

export type Item<T extends keyof ItemTypes> = {
  id: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
} & ItemKeys<ItemTypes[T]>;

type ItemKeys<T> = {
  [K in keyof T]: T[K];
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
