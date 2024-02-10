import type { Content } from "@tiptap/react";

export type Item<T = {}> = {
  id: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
} & ItemKeys<T>;

type ItemKeys<T> = {
  [K in keyof T]: T[K];
};

export type Note = {
  title: string;
  content: Content;
  isPinned: boolean;
  readonly: boolean;
  isFavourite: boolean;
  tags?: Item<Tag>[];
  folderId: string;
};

export type Tag = {
  name: string;
};

export type Folder = {
  name: string;
};

export type MenuItem = {
  key: string;
  name: string;
  Icon?: React.ReactNode;
  danger?: boolean;
  Component: React.ComponentType<{ children: React.ReactNode }>;
};
