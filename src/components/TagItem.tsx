import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { AppDispatch } from "@/app/store";
import { trashTagNotes } from "@/redux/notes/notesSlice";
import { removeTag, updateTag } from "@/redux/tags/tagsSlice";
import { PiPencilSimple } from "react-icons/pi";
import CreateTagDialog from "./Dialogs/CreateTag";
import DeleteTagDialog from "./Dialogs/DeleteTag";
import ListItem from "./ListItem";
import type { Item, MenuItem, Tag } from "./ListItem/types";
import { ContextMenuItem } from "./ui/context-menu";

type TagItemProps = {
  tag: Item<Tag>;
  handleTagClick: () => void;
};

export default function TagItem(props: TagItemProps) {
  const { tag, handleTagClick } = props;

  const { notes } = useAppSelector((state) => state.notes);

  const tagNotes = Object.values(notes).filter(
    (note) => note.tags.includes(tag.id) && note.type === "note",
  );

  const dispatch = useAppDispatch();

  return (
    <ListItem
      item={tag}
      title={
        <div className="flex justify-between">
          <p>{tag.name}</p>

          <span>{tagNotes.length}</span>
        </div>
      }
      body={""}
      footer={""}
      isSelected={false}
      onItemClick={handleTagClick}
      contextMenuItems={() => menuItems(tag, dispatch)}
    />
  );
}

const menuItems = (
  tag: Item<Tag>,
  dispatch: AppDispatch,
): Array<MenuItem | MenuItem[]> => [
  [
    {
      name: "Rename",
      key: "rename",
      Icon: <PiPencilSimple size={18} />,
      Component: ({ children }) => (
        <CreateTagDialog
          onCreateTag={(name) => {
            if (!name) return;
            dispatch(updateTag({ id: tag.id, name }));
          }}
          defaultName={tag.name}
        >
          <ContextMenuItem inset onSelect={(e) => e.preventDefault()}>
            {children}
          </ContextMenuItem>
        </CreateTagDialog>
      ),
    },
  ],
  {
    name: "Delete",
    key: "delete",
    Icon: <PiPencilSimple size={18} />,
    danger: true,
    Component: ({ children }) => (
      <DeleteTagDialog
        onDeleteTag={(deleteAllNotes) => {
          console.log(deleteAllNotes);
          if (deleteAllNotes) {
            dispatch(trashTagNotes(tag.id));
          }

          dispatch(removeTag(tag.id));
        }}
      >
        <ContextMenuItem inset onSelect={(e) => e.preventDefault()}>
          {children}
        </ContextMenuItem>
      </DeleteTagDialog>
    ),
  },
];
