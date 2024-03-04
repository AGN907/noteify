import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { trashTagNotes } from "@/redux/notes/notesSlice";
import { removeTag, updateTag } from "@/redux/tags/tagsSlice";
import { useState } from "react";
import { PiDotsThree } from "react-icons/pi";
import { CreateTagDialog, DeleteTagDialog } from "./Dialogs";
import ListItem from "./ListItem";
import type { Item, Tag } from "./ListItem/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type TagItemProps = {
  tag: Item<Tag>;
  handleTagClick: () => void;
};

export default function TagItem(props: TagItemProps) {
  const { tag, handleTagClick } = props;
  const [selectedDialog, setSelectedDialog] = useState("");

  const { notes } = useAppSelector((state) => state.notes);

  const tagNotes = notes.filter(
    (note) => note.tags.includes(tag.id) && note.type === "note",
  );

  const dispatch = useAppDispatch();

  return (
    <ListItem
      item={tag}
      title={
        <div className="relative flex justify-between">
          <span className="mr-auto">{tag.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <PiDotsThree className="absolute right-2 top-2 z-20" size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={handleTagClick}>
                  View tag
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedDialog("edit")}>
                  Edit name
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setSelectedDialog("delete")}>
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateTagDialog
            open={selectedDialog === "edit"}
            onOpenChange={(open) => setSelectedDialog(open ? "edit" : "")}
            onCreateTag={(name) => {
              dispatch(updateTag({ id: tag.id, name: name }));
            }}
            defaultName={tag.name}
          />
          <DeleteTagDialog
            open={selectedDialog === "delete"}
            onOpenChange={(open) => setSelectedDialog(open ? "delete" : "")}
            onDeleteTag={(deleteAllNotes) => {
              if (deleteAllNotes) {
                dispatch(trashTagNotes(tag.id));
              }
              dispatch(removeTag(tag.id));
            }}
          />
        </div>
      }
      footer={
        <div>
          {tagNotes.length === 0
            ? "No notes"
            : `${tagNotes.length} ${tagNotes.length === 1 ? "note" : "notes"}`}
        </div>
      }
      isSelected={false}
    />
  );
}
