export const exampleNote = {
  id: "1",
  type: "note",
  title: "Example note",
  content: "Example content",
  createdAt: 0,
  updatedAt: 0,
  deletedAt: 0,
  isPinned: false,
  isFavourite: false,
  readonly: false,
  folderId: "",
  tags: ["1"],
};

export const exampleTag = {
  id: "1",
  type: "tag",
  name: "tag1",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: 0,
};

export const exampleFolder = {
  id: "1",
  type: "folder",
  name: "folder1",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: 0,
};
