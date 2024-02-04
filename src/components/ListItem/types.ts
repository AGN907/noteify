export type Item<T = {}> = {
  id: string;
  type: string;
  createdAt: number;
  updatedAt: number;
} & ItemKeys<T>;

type ItemKeys<T> = {
  [K in keyof T]: T[K];
};

export type Note = {
  title: string;
  content: string;
  isPinned: boolean;
  isFavorite: boolean;
  tags?: Item<Tag>[];
};

export type Tag = {
  name: string;
};

export type Folder = {
  name: string;
  notes: Item<Note>[];
};

export type MenuItem = {
  key: string;
  name: string;
  onClick: () => void;
  isChecked?: boolean;
  Icon?: React.ReactNode;
  danger?: boolean;
};